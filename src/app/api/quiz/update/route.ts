import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import User from "@/app/lib/models/userModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const data = await request.json();
  const id = data._id;
  const session = await getServerSession();
  await connectToDatabase();

  try {
    const user = await User.findOne({ email: session?.user?.email });
    const createCnt = await Question.countDocuments({ userId: user._id });

    const updatedQuestion = await Question.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedQuestion) {
      console.log(createCnt + 1);
      await User.updateOne(
        { _id: user.id },
        { $set: { createCnt: createCnt + 1 } }
      );
      Question.create(data);
      return NextResponse.json(
        { message: "New quiz posted!" },
        { status: 200 }
      );
    }
    return NextResponse.json(updatedQuestion, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
