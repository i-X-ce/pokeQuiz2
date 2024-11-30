import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import User from "@/app/lib/models/userModel";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // v3用のインポート
import { NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// multerのメモリストレージ設定
const upload = multer({
  storage: multer.memoryStorage(),
});

// ファイルアップロード用の関数を作成
const uploadMiddleware = upload.single("image");

// API Handlerのラッパー
async function runMiddleware(req: any, res: any, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export async function PUT(req: any, res: any) {
  try {
    // multerミドルウェアを実行
    await runMiddleware(req, res, uploadMiddleware);

    // multerで処理されたファイルはreq.fileに格納される
    const file = req.file;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    // S3にアップロード
    const bucketName = process.env.AWS_BUCKET_NAME!;
    const key = `uploads/${Date.now()}_${file.originalname}`;

    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read", // 公開アクセス（必要に応じて変更）
    };

    const command = new PutObjectCommand(uploadParams);
    const s3UploadResult = await s3.send(command);

    // アップロード結果のURLを作成（S3の構成に応じて変更）
    const imageUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    console.log("Uploaded file URL:", imageUrl);

    // リクエストからその他のデータを取得
    const data = JSON.parse(req.body.data); // 必要ならデータ形式を調整
    const id = data._id;

    const session = await getServerSession();
    await connectToDatabase();

    delete data._id;

    const user = await User.findOne({ email: session?.user?.email });
    const createCnt = await Question.countDocuments({ userId: user._id });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      // 新しいデータに画像URLを追加
      data.image = imageUrl;

      Question.create(data);
      await User.updateOne(
        { _id: user.id },
        { $set: { createCnt: createCnt + 1 } }
      );
      return NextResponse.json(
        { message: "New quiz posted!", imageUrl },
        { status: 200 }
      );
    } else {
      if (await Question.exists({ _id: id })) {
        data.image = imageUrl;
        await Question.findByIdAndUpdate(id, data, {
          new: true,
        });
      }
      return NextResponse.json(
        { message: "Updated quiz!", imageUrl },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
