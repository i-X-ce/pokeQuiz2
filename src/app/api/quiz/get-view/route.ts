import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const index: number = Number(req.nextUrl.searchParams.get("index")); // 始まりのindex
  const size: number = Number(req.nextUrl.searchParams.get("size")); // 取得するクイズの数
  const sortType = req.nextUrl.searchParams.get("sortType");

  if (index === undefined || size === undefined || sortType === undefined) {
    return NextResponse.json(
      { message: "Parameters not set correctly." },
      { status: 404 }
    );
  }

  let questions = await Question.aggregate([
    { $match: { userId: { $ne: null } } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    {
      $addFields: {
        correctRate: { $divide: ["$correctCnt", "$answerCnt"] },
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: index },
    { $limit: size },
  ]);

  questions.forEach((q) => {
    q.userName = !q.anonymity ? q.userInfo.nickname : "けつばん";
    delete q.userInfo;
    delete q.userId;
  });

  return NextResponse.json(questions, { status: 200 });
}
