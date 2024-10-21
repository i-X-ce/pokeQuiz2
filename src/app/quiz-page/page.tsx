"use client";
import { log } from "console";
import { useEffect, useState } from "react";

interface Question {
  question: string;
  answers: string[];
  correct: number;
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    fetch("/api/quizController")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching quiz data:", err));
  }, []);

  const handleAnswer = (answerIndex: number) => {
    if ((questions[currentQuestion].correct as number) === answerIndex) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
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
      <h1>{questions[currentQuestion].question}</h1>
      {questions[currentQuestion].answers.map((answer, index) => (
        <button key={index} onClick={() => handleAnswer(index)}>
          {answer}
        </button>
      ))}
    </>
  );
}
