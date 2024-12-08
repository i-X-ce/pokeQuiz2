import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import User from "@/app/lib/models/userModel";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const data = await req.json();
  const id = data._id;
  const session = await getServerSession();
  await connectToDatabase();
  delete data._id;

  try {
    const user = await User.findOne({ email: session?.user?.email });
    const createCnt = await Question.countDocuments({ userId: user._id });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      Question.create(data);
      await User.updateOne(
        { _id: user.id },
        { $set: { createCnt: createCnt + 1 } }
      );
      return NextResponse.json(
        { message: "New quiz posted!" },
        { status: 200 }
      );
    } else {
      if (await Question.exists({ _id: id }))
        await Question.findByIdAndUpdate(id, data, {
          new: true,
        });
      return NextResponse.json({ message: "Updated quiz!" }, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
