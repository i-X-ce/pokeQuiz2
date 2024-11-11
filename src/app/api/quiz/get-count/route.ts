import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import { NextResponse } from "next/server";

// クイズの数を取得する
export async function GET() {
  await connectToDatabase();
  const cnt = await Question.countDocuments();
  return NextResponse.json(cnt, { status: 200 });
}
