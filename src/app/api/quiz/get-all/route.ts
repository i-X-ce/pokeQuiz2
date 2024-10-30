import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import { NextResponse } from "next/server";

export async function GET() {
    await connectToDatabase();
    const questions = await Question.find({}).exec();
    return NextResponse.json(questions);
}
