import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import User from "@/app/lib/models/userModel";
import { s3Client } from "@/app/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getServerSession();
    const quizId = req.nextUrl.searchParams.get("id");
    const quiz = await Question.findById(quizId);
    const userId = (await User.findOne({ email: session?.user?.email }))?._id;

    if (!quiz || quiz?.userId.toString() !== userId.toString()) {
      return NextResponse.json({ error: "Not authorised" }, { status: 401 });
    }

    //画像の消去も行う
    if (quiz.img) {
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `uploads/${quiz._id + quiz.img}`,
      });
      s3Client.send(command);
    }

    await Question.deleteOne({ _id: quiz._id });
    await User.updateOne({ _id: userId }, { $inc: { createCnt: -1 } });

    return NextResponse.json(
      { message: "クイズを削除しました" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "クイズの削除に失敗しました" },
      { status: 500 }
    );
  }
}
