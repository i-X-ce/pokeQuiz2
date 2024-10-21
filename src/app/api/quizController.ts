import { NextApiRequest, NextApiResponse } from "next";

const quizData = [
  { question: "What is 2 + 2?", answers: ["3", "4", "5", "6"], correct: 1 },
  {
    question: "What is the capital of France?",
    answers: ["Paris", "London", "Berlin", "Japan"],
    correct: 0,
  },
];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(quizData);
};
