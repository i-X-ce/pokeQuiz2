import Question from "@/app/lib/models/quizModel";
import User from "@/app/lib/models/userModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// ダミーのクイズデータを作る
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (session?.user?.email != process.env.MY_EMAIL) {
    return NextResponse.json({ message: "権限がありません" }, { status: 500 });
  }

  const me = await User.findOne({ email: session?.user?.email });

  const newQuestion = {
    question: "こんにちは。これはダミー問題です。適当に作られています。",
    choices: ["1", "2", "3", "4", "5", "6", "7", "8"],
    correctAnswer: 0,
    description:
      "これはダミー問題なので、解説なんてありませんよwww。なに期待しているんですかwww。",
    userId: me._id,
  };

  const L = 100;
  for (let i = 0; i < L; i++) {
    Question.create({
      ...newQuestion,
      title: `${i}番目のダミー問題`,
      anonymity: i % 2 == 1,
      answerCnt: L,
      correctCnt: i,
    });
  }
  return NextResponse.json({ messagge: "ダミー問題を作成しました" });
}
