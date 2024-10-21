import { NextResponse } from "next/server";

const quizData = [
  { question: "What is 2 + 2?", answers: ["3", "4", "5", "6"], correct: 1 },
  {
    question: "What is the capital of France?",
    answers: ["Paris", "London", "Berlin", "Japan"],
    correct: 0,
  },
];

export async function GET() {
  return NextResponse.json(quizData);
}
