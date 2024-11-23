import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import User from "@/app/lib/models/userModel";
import { NextRequest, NextResponse } from "next/server";

// 一括で複数のクイズデータの更新を行う
export async function PUT(req: NextRequest) {
  await connectToDatabase();
  const questions = await req.json();

  try {
    questions.forEach(async (q: any) => {
      await Question.findByIdAndUpdate(q._id, {
        $inc: { correctCnt: q.isCorrect ? 1 : 0, answerCnt: 1 },
      });
      await User.findByIdAndUpdate(q.userId, { $inc: { solvedCnt: 1 } });
    });
    return NextResponse.json(
      { message: "Updated quiz data scores" },
      { status: 200 }
    );
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
