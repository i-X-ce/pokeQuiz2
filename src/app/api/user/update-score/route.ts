import connectToDatabase from "@/app/lib/conectMongoDB";
import User from "@/app/lib/models/userModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// ユーザーの正答率を更新する
export async function PUT(req: NextRequest) {
  await connectToDatabase();
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { addAnswerCnt, addCorrectCnt } = await req.json();
  await User.findOneAndUpdate(
    { email: session.user?.email },
    { $inc: { answerCnt: addAnswerCnt, correctCnt: addCorrectCnt } }
  );
  return NextResponse.json({ message: "ユーザーが更新されました" });
}
