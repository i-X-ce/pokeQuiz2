import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import User from "@/app/lib/models/userModel";
import { s3Client } from "@/app/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const session = await getServerSession();
  const quizId = req.nextUrl.searchParams.get("id");
  const quiz = await Question.findById(quizId);
  const userId = (await User.findOne({ email: session?.user?.email }))?._id;

  if (!quiz || quiz?.userId.toString() !== userId.toString()) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  if (quiz.img) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: "uploads/" + quiz._id + quiz.img,
    });
    quiz.img = await getSignedUrl(s3Client, command, {
      expiresIn: 1800,
    });
  }
  return NextResponse.json({ quiz }, { status: 200 });
}
