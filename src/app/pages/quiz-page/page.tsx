"use client";
import { Loading } from "@/app/components/common/Loading/page";
import HeadContainer from "@/app/components/quiz/HeadContainer/page";
import PastQuestionContainer from "@/app/components/quiz/PastQuestionContainer/page";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { Title } from "@/app/components/common/Title/page";
import { Button, Divider, Modal } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

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
      <Title title="結果発表！！" color="red" />
      <div className={styles.resultContainer}>
        <div className={styles.score}>
          {score}/{questions.length}
        </div>
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "20px",
          }}
        >
          <Button
            startIcon={
              <span style={{ display: "flex", alignItems: "center" }}>
                <KeyboardArrowLeft sx={{ fontSize: "3rem" }} />
              </span>
            }
            variant="contained"
            color="blue"
            sx={{
              fontSize: "2rem",
              padding: "20px 150px 20px 50px",
              borderRadius: "20px 0 0 20px",
              color: "var(--bc-white)",
            }}
            component="a"
            href="/pages/quiz-page"
          >
            もう一度
          </Button>
          <Button
            endIcon={
              <span style={{ display: "flex", alignItems: "center" }}>
                <KeyboardArrowRight sx={{ fontSize: "3rem" }} />
              </span>
            }
            variant="contained"
            color="yellow"
            sx={{
              fontSize: "2rem",
              padding: "20px 50px 20px 150px",
              borderRadius: "0 20px 20px 0",
              color: "var(--bc-white)",
            }}
            component="a"
            href="/"
          >
            ホームへ
          </Button>
        </span>
      </div>
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
      {/* {isAnswer ? <DescriptionContainer {...question} /> : null} */}

      <Modal
        open={openDescription}
        onClose={() => {
          setOpenDescription(false);
        }}
      >
        <>
          <h1 className={question?.isCorrect ? "font-red" : "font-blue"}>
            {question?.isCorrect ? "正解" : "不正解"}
          </h1>
          <h3>
            正解は「{question?.choices[question.correctAnswer as number]}」!
          </h3>
          <div>{question?.description}</div>
          <Divider />
          {/* <Button
            variant="plain"
            color="primary"
            size="lg"
            sx={{ fontSize: "1.25rem" }}
            onClick={handleNext}
          >
            {currentQuestionIndex < questions.length - 1
              ? "次のクイズへ"
              : "結果を見る"}
            →
          </Button> */}
        </>
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
      <div style={{ display: "flex", justifyContent: "end", margin: "20px" }}>
        {isAnswer ? (
          <Button
            variant="outlined"
            sx={{ fontSize: "1.25rem" }}
            onClick={handleNext}
            color="red"
          >
            {currentQuestionIndex < questions.length - 1
              ? "次のクイズへ"
              : "結果を見る"}
            →
          </Button>
        ) : null}
      </div>
    </>
  );
}
