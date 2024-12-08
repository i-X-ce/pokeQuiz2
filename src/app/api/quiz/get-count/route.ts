import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import User from "@/app/lib/models/userModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// クイズの数を取得する
export async function GET(req: NextRequest) {
  await connectToDatabase();
  const range = req.nextUrl.searchParams.get("range");
  let match = { userId: { $ne: null } };

  // 自分のだったとき
  if (range === "mine") {
    const email = (await getServerSession())?.user?.email;

    if (!email) {
      return NextResponse.json(
        { error: "No query parameters provided" },
        { status: 400 }
      );
    }
    const userId = (await User.findOne({ email }))._id;
    match = { userId: userId };
  }

  const cnt = await Question.countDocuments(match);
  return NextResponse.json(cnt, { status: 200 });
}
