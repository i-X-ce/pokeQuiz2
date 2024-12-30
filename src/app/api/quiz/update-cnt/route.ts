import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import User from "@/app/lib/models/userModel";
import { NextRequest, NextResponse } from "next/server";

// 一括で複数のクイズデータの更新を行う
export async function PUT(req: NextRequest) {
  await connectToDatabase();
  const questions = await req.json();

  try {
    questions.forEach(
      async (q: { _id: string; isCorrect: boolean; userId: string }) => {
        await Question.findByIdAndUpdate(q._id, {
          $inc: { correctCnt: q.isCorrect ? 1 : 0, answerCnt: 1 },
        });
        await User.findByIdAndUpdate(q.userId, { $inc: { solvedCnt: 1 } });
      }
    );
    return NextResponse.json(
      { message: "Updated quiz data scores" },
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
