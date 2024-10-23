"use client";
import HeadContainer from "@/app/components/headContainer/page";
import { log } from "console";
import { useEffect, useState } from "react";

interface Question {
  question: string;
  choices: string[];
  correctAnswer: number;
  imageUrl?: String,
  answerCnt: Number,
  correctCnt: Number,
  description: String,
  userName?: String,
  title: String,
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [question, setQuestion] = useState<Question>();
  const [currentQuestionIndex, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    fetch("/api/quiz-get-all")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching quiz data:", err));
  }, []);

  const handleAnswer = (answerIndex: number) => {
    if ((questions[currentQuestionIndex].correctAnswer as number) === answerIndex) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setQuestion(questions[currentQuestionIndex]);
    } else {
      setIsFinished(true);
    }
  };

  if (questions.length === 0) {
    console.log(questions);
    return <div>Loading...</div>;
  }

  return isFinished ? (
    <>
      <div>Score: {score}</div>
    </>
  ) : (
    <>
      <HeadContainer title={question?.title || "No title"} />
      <h1>{questions[currentQuestionIndex].question}</h1>
      {questions[currentQuestionIndex].choices.map(
        (answer: string, index: number) => (
          <button key={index} onClick={() => handleAnswer(index)}>
            {answer}
          </button>
        )
      )}
    </>
  );
}
