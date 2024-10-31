"use client";
import DescriptionContainer from "@/app/components/quiz/DescriptionContainer/page";
import HeadContainer from "@/app/components/quiz/HeadContainer/page";
import PastQuestionContainer from "@/app/components/quiz/PastQuestionContainer/page";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Question {
  _id: string;
  question: string;
  choices: string[];
  correctAnswer: Number;
  imageUrl?: String;
  answerCnt: Number;
  correctCnt: Number;
  description: String;
  userName?: String;
  title: String;
  isCorrect: boolean;
  choiceAnswer: number;
  userId: string;
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [question, setQuestion] = useState<Question>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isAnswer, setIsAnswer] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/quiz/get-all")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setQuestion(data[0]);
      })
      .catch((err) => console.error("Error fetching quiz data:", err));
  }, []);

  // ボタン押したとき
  const handleAnswer = (answerIndex: number) => {
    if (isAnswer) return;
    setIsAnswer(true);
    const isCorrect = (question!.correctAnswer as number) === answerIndex;
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, index) =>
        index === currentQuestionIndex
          ? { ...q, isCorrect: isCorrect, choiceAnswer: answerIndex }
          : q
      )
    );
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (!isAnswer) return;
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      // 次の問題へ進む
      setCurrentQuestionIndex(nextQuestion);
      setQuestion(questions[nextQuestion]);
      setIsAnswer(false);
    } else {
      // 終わり
      setIsFinished(true);
      questions.forEach(async (temp, index) => {
        const updateData = {
          ...temp,
          answerCnt: ((temp.answerCnt as number) || 0) + 1,
          correctCnt:
            ((temp.correctCnt as number) || 0) + (temp.isCorrect ? 1 : 0),
        };
        axios.put("/api/quiz/update", updateData);
      });
    }
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  return isFinished ? (
    <>
      <div>Score: {score}</div>
      <Link href="../">戻る</Link>
      <PastQuestionContainer questions={questions} />
    </>
  ) : (
    <>
      <HeadContainer
        title={question!.title}
        user={question!.userName}
        percentage={
          (question?.answerCnt as number) > 0
            ? (
                (100 * (question!.correctCnt as number)) /
                (question!.answerCnt as number)
              ).toFixed(1)
            : "0.0"
        }
        score={score}
      />
      <div>{question!.question}</div>
      {isAnswer ? <DescriptionContainer {...question} /> : null}
      {question!.choices.map((answer: string, index: number) => (
        <button key={index} onClick={() => handleAnswer(index)}>
          {answer}
        </button>
      ))}
      {isAnswer ? <button onClick={handleNext}>次へ</button> : null}
    </>
  );
}
