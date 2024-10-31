import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const data = await request.json();
  const id = data._id;
  await connectToDatabase();

  try {
    const updatedQuestion = await Question.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedQuestion) {
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
