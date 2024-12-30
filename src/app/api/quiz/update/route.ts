import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import User from "@/app/lib/models/userModel";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { s3Client } from "@/app/lib/s3";
import sharp from "sharp";
import * as Jimp from "jimp";

async function createUploadParams(id: string, buffer: Buffer) {
  const image = await Jimp.Jimp.read(buffer);
  const pngBuffer = await image.getBuffer(Jimp.JimpMime.png);
  const compressedBuffer = await compressFileImage(pngBuffer);

  return new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME, // S3のバケット名
    Key: `uploads/${id}.webp`, // 保存するファイル名（例: uploads/filename.jpg）
    Body: compressedBuffer, // ファイルのバイナリデータ
    ContentType: "image/webp", // ファイルのMIMEタイプ
    ACL: "private", // 読み取りアクセス設定（公開する場合）
  });
  // const extension = path.extname(file.name);
  // return new PutObjectCommand({
  //   Bucket: process.env.AWS_S3_BUCKET_NAME, // S3のバケット名
  //   Key: `uploads/${id + ".webp"}`, // 保存するファイル名（例: uploads/filename.jpg）
  //   Body: buffer, // ファイルのバイナリデータ
  //   ContentType: "image/webp", // ファイルのMIMEタイプ
  //   // ContentType: file.type, // ファイルのMIMEタイプ
  //   ACL: "private", // 読み取りアクセス設定（公開する場合）
  // });
}

async function createDeleteParams(id: string, extension: string) {
  return new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `uploads/${id + extension}`,
  });
}

// 画像の圧縮
async function compressFileImage(buffer: Buffer) {
  try {
    const compressedBuffer = await sharp(buffer)
      .resize(800)
      .webp({ quality: 80 })
      .toBuffer();
    return compressedBuffer;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    await connectToDatabase();

    const formData = await req.formData();
    const image = formData.get("image");
    const data = JSON.parse(formData.get("json") as string);
    const id = data._id;
    delete data._id;
    const user = await User.findOne({ email: session?.user?.email });
    const createCnt = await Question.countDocuments({ userId: user._id });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const newQuestion = await Question.create(data);
      await User.updateOne(
        { _id: user.id },
        { $set: { createCnt: createCnt + 1 } }
      );
      if (image && image instanceof File) {
        const buffer = Buffer.from(await image.arrayBuffer());
        // const buffer = await compressFileImage(
        //   Buffer.from(await image.arrayBuffer())
        // ); // バッファを取得
        const uploadParams = await createUploadParams(newQuestion._id, buffer);
        const uploadData = await s3Client.send(uploadParams);
        await Question.findByIdAndUpdate(newQuestion._id, {
          // img: path.extname(image.name),
          img: ".webp",
        });
        console.log(uploadData);
      }

      return NextResponse.json(
        { message: "New quiz posted!" },
        { status: 200 }
      );
    } else {
      const question = await Question.findById(id);

      if (data.imgDelete) {
        const command = await createDeleteParams(id, question.img);
        await s3Client.send(command);
        delete data.img;
        await Question.findByIdAndUpdate(id, { $unset: { img: "" } });
      }
      if (image && image instanceof File) {
        const command = await createUploadParams(
          id,
          Buffer.from(await image.arrayBuffer())
          // await compressFileImage(Buffer.from(await image.arrayBuffer()))
        );
        // data.img = path.extname(image.name);
        data.img = ".webp";
        await s3Client.send(command);
      }

      await Question.findByIdAndUpdate(id, data);
      return NextResponse.json({ message: "Updated quiz!" }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
