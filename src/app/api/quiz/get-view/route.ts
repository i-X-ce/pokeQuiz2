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

  let sortField: string = "createdAt",
    sortOrder: number = 1;
  switch (sortType) {
    case "newest":
      sortField = "createdAt";
      sortOrder = -1;
      break;
    case "oldest":
      sortField = "createdAt";
      sortOrder = 1;
      break;
    case "rateHighest":
      sortField = "correctRate";
      sortOrder = -1;
      break;
    case "rateLowest":
      sortField = "correctRate";
      sortOrder = 1;
      break;
    case "answerHighest":
      sortField = "answerCnt";
      sortOrder = -1;
      break;
    case "answerLowest":
      sortField = "answerCnt";
      sortOrder = 1;
      break;
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
    { $sort: { [sortField]: sortOrder } },
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
