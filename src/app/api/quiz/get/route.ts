import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import User from "@/app/lib/models/userModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const session = await getServerSession();
  const quizId = req.nextUrl.searchParams.get("id");
  const quiz = await Question.findById(quizId);
  const userId = (await User.findOne({ email: session?.user?.email }))?._id;

  if (!quiz || quiz?.userId.toString() !== userId.toString()) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  return NextResponse.json({ quiz }, { status: 200 });
}
