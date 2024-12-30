import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import { s3Client } from "@/app/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

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

  try {
    // eslint-disable-next-line
    let matches: any = { $match: { userId: { $ne: null } } };
    if (difficulty === "specific") {
      const ids = req.nextUrl.searchParams
        .get("ids")
        ?.split(",")
        .map((id) => new ObjectId(id));
      if (!ids) {
        return NextResponse.json(
          { message: "Parameters not set correctly." },
          { status: 404 }
        );
      }
      matches.$match._id = { $in: ids };
    }

    const questions = await Question.aggregate([
      matches,
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
        $sort: { divisionResult: 1 },
      },
    ]);

    let resQuestions = [];

    // 新しい問題
    if (difficulty === "newest") {
      const newQuestions = questions.filter((q) => (q.answerCnt || 0) < 10);
      newQuestions.sort(() => Math.random() - 0.5);
      resQuestions = newQuestions.slice(0, questionCount);
    } else if (difficulty === "specific") {
      resQuestions = questions;
    } else {
      // 難易度別問題
      let filteredQuestions = questions.filter((q) => (q.answerCnt || 0) >= 10);
      const collectionSize: number = filteredQuestions.length;
      let startIndex;
      switch (difficulty) {
        case "hard":
          startIndex = 0;
          break;
        case "normal":
          startIndex = Math.floor(collectionSize / 3);
          break;
        case "easy":
          startIndex = Math.floor((collectionSize / 3) * 2);
          break;
        default:
          startIndex = 0;
      }
      filteredQuestions = filteredQuestions.filter((index: number) => {
        return index >= startIndex && index < startIndex + collectionSize / 3;
      });
      filteredQuestions.sort(() => Math.random() - 0.5);
      resQuestions = filteredQuestions.slice(0, questionCount);
    }

    for (let i = 0; i < resQuestions.length; i++) {
      // eslint-disable-next-line
      let q: any = resQuestions[i];
      q.userName = !q.anonymity ? q.userInfo.nickname : "けつばん";
      delete q.userInfo;
      delete q.correctAnswer;
      delete q.description;
      if (q.img) {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: "uploads/" + q._id + q.img,
        });
        q.img = await getSignedUrl(s3Client, command, {
          expiresIn: 1800,
        });
      }
    }
    return NextResponse.json(resQuestions, { status: 200 });

    // let resQuestions: any[] = [];
    // let mp = new Set<number>();
    // for (let i = 0; i < Math.min(questionCount, collectionSize); i++) {
    //   let index = 0;
    //   const difNum =
    //     difficulty === "hard" ? 0 : difficulty === "normal" ? 1 : 2;

    //   do {
    //     index = Math.floor(
    //       (Math.random() * collectionSize) / 3 + (difNum * collectionSize) / 3
    //     );
    //     if (mp.has(index)) continue;
    //     mp.add(index);
    //     break;
    //   } while (true);
    //   let q = filteredQuestions[index];
    //   q.userName = !q.anonymity ? q.userInfo.nickname : "けつばん";
    //   delete q.userInfo;
    //   delete q.correctAnswer;
    //   delete q.description;
    //   // delete q.userId;
    //   if (q.img) {
    //     const command = new GetObjectCommand({
    //       Bucket: process.env.AWS_S3_BUCKET_NAME,
    //       Key: "uploads/" + q._id + q.img,
    //     });
    //     q.img = await getSignedUrl(s3Client, command, {
    //       expiresIn: 1800,
    //     });
    //   }
    //   resQuestions.push(q);
    // }

    // return NextResponse.json(resQuestions, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
