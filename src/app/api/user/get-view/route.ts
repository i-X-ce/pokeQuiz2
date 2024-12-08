import connectToDatabase from "@/app/lib/conectMongoDB";
import User from "@/app/lib/models/userModel";
import { NextRequest, NextResponse } from "next/server";

// ユーザーの情報を一括で取得するAPI
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

  let sortField: string = "correctCnt";
  switch (sortType) {
    case "correct":
      sortField = "correctCnt";
      break;
    case "answer":
      sortField = "answerCnt";
      break;
    case "create":
      sortField = "createCnt";
      break;
    case "solved":
      sortField = "solvedCnt";
  }

  let users = await User.aggregate([
    {
      $addFields: {
        correctRate: { $divide: ["$correctCnt", "$answerCnt"] },
      },
    },
    { $sort: { [sortField]: -1 } },
    { $skip: index },
    { $limit: size },
  ]);

  users.forEach((u) => {
    delete u._id;
    delete u.email;
  });
  return NextResponse.json(users, { status: 200 });
}
