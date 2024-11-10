import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import { NextRequest, NextResponse } from "next/server";
import { userInfo } from "os";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const questionCount: number = Number(
    req.nextUrl.searchParams.get("questionCount")
  );
  const difficulty = req.nextUrl.searchParams.get("difficulty");

  if (!questionCount || !difficulty) {
    return NextResponse.json(
      { message: "Parameters not set correctly." },
      { status: 404 }
    );
  }

  const sortQuestions = await Question.aggregate([
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
        divisionResult: { $divide: ["$correctCnt", "$answerCnt"] },
      },
    },
    {
      $sort: { divisionResult: difficulty === "hard" ? 1 : -1 },
    },
  ]);
  const collectionSize = sortQuestions.length;

  let resQuestions: any[] = [];
  let mp = new Set<number>();
  for (let i = 0; i < questionCount; i++) {
    let index = 0;
    do {
      index = Math.floor((Math.random() * collectionSize) / 2);
      if (mp.has(index)) continue;
      mp.add(index);
      break;
    } while (true);
    let q = sortQuestions[index];
    q.userName = q.anonymity ? q.userInfo.nickname : "けつばん";
    delete q.userInfo;
    delete q.userId;
    resQuestions.push(q);
  }

  return NextResponse.json(resQuestions, { status: 200 });
}
