"use client";
import { Loading } from "@/app/components/common/Loading/page";
import DescriptionContainer from "@/app/components/quiz/DescriptionContainer/page";
import HeadContainer from "@/app/components/quiz/HeadContainer/page";
import PastQuestionContainer from "@/app/components/quiz/PastQuestionContainer/page";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./style.module.css";
import {
  Button,
  Modal,
  ModalClose,
  ModalDialog,
  Sheet,
  Typography,
} from "@mui/joy";

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

const choiceColors = [
  styles.choiceRed,
  styles.choiceGreen,
  styles.choiceBlue,
  styles.choiceYellow,
];

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [question, setQuestion] = useState<Question>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isAnswer, setIsAnswer] = useState<boolean>(false);
  const [openDescription, setOpenDescription] = useState(false);

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
    setOpenDescription(true);
    if (isAnswer) return;
    setIsAnswer(true);
    const isCorrect = (question!.correctAnswer as number) === answerIndex;
    setQuestion({ ...question, isCorrect } as Question);
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
      setOpenDescription(false);
    } else {
      // 終わり
      setIsFinished(true);
      questions.forEach(async (temp) => {
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
    return <Loading />;
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
      <div className={styles.questionContainer}>
        <div className={styles.questionNumber}>{currentQuestionIndex + 1}</div>
        <div className={styles.questionText}>{question!.question}</div>
      </div>
      {isAnswer ? <DescriptionContainer {...question} /> : null}

      <Modal
        open={openDescription}
        onClose={() => {
          setOpenDescription(false);
        }}
      >
        <ModalDialog>
          <ModalClose />
          <Typography level="h1">
            {question?.isCorrect ? "正解" : "不正解"}
          </Typography>
        </ModalDialog>
      </Modal>
      <div className={styles.choicesContainer}>
        {question!.choices.map((answer: string, index: number) => (
          <div
            className={`${styles.choice} ${choiceColors[index % 4]}`}
            key={index}
            onClick={() => handleAnswer(index)}
          >
            {answer}
          </div>
        ))}
      </div>
      {isAnswer ? <button onClick={handleNext}>次へ</button> : null}
    </>
  );
}
