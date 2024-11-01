import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import { NextResponse, userAgent } from "next/server";

export async function GET() {
  await connectToDatabase();

  const questions = await Question.find({ userId: { $ne: null } })
    .populate("userId")
    .lean();
  const res = questions.map((q) => ({
    ...q,
    userName: q.anonymity ? "けつばん" : q.userId.nickname,
  }));
  return NextResponse.json(res);
}
