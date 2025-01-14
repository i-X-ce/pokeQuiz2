import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import User from "@/app/lib/models/userModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const L = 100; // 作成するダミーデータの数

// ダミーのクイズデータを作る
export async function POST() {
  const session = await getServerSession();
  if (session?.user?.email != process.env.MY_EMAIL) {
    return NextResponse.json({ message: "権限がありません" }, { status: 401 });
  }

  await connectToDatabase();
  const me = await User.findOne({ email: session?.user?.email });
  const dummy = await User.findOne({ email: "thisisdummyemail0@gmail.com" });

  const newQuestion = {
    question: "こんにちは。これはダミー問題です。適当に作られています。",
    choices: ["1", "2", "3", "4", "5", "6", "7", "8"],
    correctAnswer: 0,
    description:
      "これはダミー問題なので、解説なんてありませんよwww。なに期待しているんですかwww。",
  };

  for (let i = 0; i < L; i++) {
    Question.create({
      ...newQuestion,
      title: `${i}番目のダミー問題`,
      anonymity: i % 10 === 0,
      answerCnt: L,
      correctCnt: i,
      userId: i % 7 === 0 ? dummy._id : me._id,
    });
  }
  return NextResponse.json({ messagge: "ダミー問題を作成しました" });
}
