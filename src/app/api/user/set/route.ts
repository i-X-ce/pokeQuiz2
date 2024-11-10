import connectToDatabase from "@/app/lib/conectMongoDB";
import User from "@/app/lib/models/userModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { nickname, answerCnt, correctCnt } = await req.json();

  await User.findOneAndUpdate(
    { email: session.user!.email },
    { nickname, answerCnt, correctCnt }
  );
  console.log(session.user?.email, nickname, "を更新");
  return NextResponse.json({ message: "ユーザーが更新されました" });
}
