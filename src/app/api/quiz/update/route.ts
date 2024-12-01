import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import User from "@/app/lib/models/userModel";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import path from "path";
import { s3Client } from "@/app/lib/s3";

export async function PUT(req: Request, res: any) {
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
        const buffer = Buffer.from(await image.arrayBuffer()); // バッファを取得
        const extension = path.extname(image.name);
        const uploadParams = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME, // S3のバケット名
          Key: `uploads/${newQuestion._id + extension}`, // 保存するファイル名（例: uploads/filename.jpg）
          Body: buffer, // ファイルのバイナリデータ
          ContentType: image.type, // ファイルのMIMEタイプ
          ACL: "private", // 読み取りアクセス設定（公開する場合）
        });
        const uploadData = await s3Client.send(uploadParams);
        await Question.findByIdAndUpdate(newQuestion._id, { img: extension });
        console.log(uploadData);
      }

      return NextResponse.json(
        { message: "New quiz posted!" },
        { status: 200 }
      );
    } else {
      await Question.findByIdAndUpdate(id, data, {
        new: true,
      });
      return NextResponse.json({ message: "Updated quiz!" }, { status: 200 });
    }
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
