import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import { NextRequest, NextResponse } from "next/server";

// 正誤判定と説明を返す
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const answerIndex = Number(req.nextUrl.searchParams.get("answerIndex"));

  try {
    if (id === undefined) {
      return NextResponse.json({ error: "Invalid parameter" }, { status: 500 });
    }
    await connectToDatabase();
    const question = await Question.findById(id);
    const isCorrect = question.correctAnswer === answerIndex;
    const description = question.description;
    const correctAnswer = question.correctAnswer;
    return NextResponse.json(
      { isCorrect, description, correctAnswer },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
