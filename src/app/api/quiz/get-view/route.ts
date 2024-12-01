import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import User from "@/app/lib/models/userModel";
import { s3Client } from "@/app/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const index: number = Number(req.nextUrl.searchParams.get("index")); // 始まりのindex
  const size: number = Number(req.nextUrl.searchParams.get("size")); // 取得するクイズの数
  const sortType = req.nextUrl.searchParams.get("sortType");
  const range = req.nextUrl.searchParams.get("range");

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

  let match = { $match: { userId: { $ne: null } } };
  const email = (await getServerSession())?.user?.email;
  const userId = (await User.findOne({ email }))?._id;

  // 自分のだったとき
  if (range === "mine") {
    if (!email) {
      return NextResponse.json(
        { error: "No query parameters provided" },
        { status: 400 }
      );
    }
    match = { $match: { userId: userId } };
  }

  let questions = await Question.aggregate([
    match,
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
        isMe: { $eq: ["$userInfo._id", userId] },
      },
    },
    { $sort: { [sortField]: sortOrder } },
    { $skip: index },
    { $limit: size },
  ]);

  // questions.forEach(async (q) => {
  //   q.userName = !q.anonymity ? q.userInfo.nickname : "けつばん";
  //   delete q.userInfo;
  //   delete q.userId;

  //   if (q.img) {
  //     const command = new GetObjectCommand({
  //       Bucket: process.env.AWS_S3_BUCKET_NAME,
  //       Key: "uploads/" + q._id + q.img,
  //     });
  //     q.img = await getSignedUrl(s3Client, command, {
  //       expiresIn: 1800,
  //     });
  //   }
  // });

  for (const q of questions) {
    q.userName = !q.anonymity ? q.userInfo.nickname : "けつばん";
    delete q.userInfo;
    delete q.userId;

    if (q.img) {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: "uploads/" + q._id + q.img,
      });
      q.img = await getSignedUrl(s3Client, command, {
        expiresIn: 60,
      });
    }
  }
  console.log(questions);

  return NextResponse.json(questions, { status: 200 });
}
