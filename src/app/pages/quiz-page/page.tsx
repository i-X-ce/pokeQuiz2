"use client";
import { Loading } from "@/app/components/common/Loading/page";
import HeadContainer from "@/app/components/quiz/HeadContainer/page";
import PastQuestionContainer from "@/app/components/quiz/PastQuestionContainer/page";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { Title } from "@/app/components/common/Title/page";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
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
  const question = useRef<Question>();
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
        question.current = data[0];
      })
      .catch((err) => console.error("Error fetching quiz data:", err));
  }, []);

  // ボタン押したとき
  const handleAnswer = (answerIndex: number) => {
    setOpenDescription(true);
    if (isAnswer) return;
    setIsAnswer(true);
    const isCorrect =
      (question.current!.correctAnswer as number) === answerIndex;
    question.current = { ...question.current, isCorrect } as Question;
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
      question.current = questions[nextQuestion];
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
      <PastQuestionContainer questions={questions} />
    </>
  ) : (
    <>
      <HeadContainer
        title={question.current!.title}
        user={question.current!.userName}
        percentage={
          (question.current?.answerCnt as number) > 0
            ? (
                (100 * (question.current!.correctCnt as number)) /
                (question.current!.answerCnt as number)
              ).toFixed(1)
            : "0.0"
        }
        score={score}
      />
      <div className={styles.questionContainer}>
        <div className={styles.questionNumber}>{currentQuestionIndex + 1}</div>
        <div className={styles.questionText}>{question.current!.question}</div>
      </div>
      {/* {isAnswer ? <DescriptionContainer {...question} /> : null} */}

      {isAnswer ? (
        <Dialog
          open={openDescription}
          onClose={() => {
            setOpenDescription(false);
          }}
          sx={{ padding: "50px" }}
        >
          <DialogTitle>
            <div
              className={`${styles.isCorrect} ${
                question.current?.isCorrect ? "font-red" : "font-blue"
              }`}
            >
              {question.current?.isCorrect ? "正解" : "不正解"}
            </div>
          </DialogTitle>
          <DialogContent>
            <div className={styles.correctAnswer}>
              正解は「
              {
                question.current?.choices[
                  question.current.correctAnswer as number
                ]
              }
              」!
            </div>
            <div>{question.current?.description}</div>
          </DialogContent>
          <Divider />
          <Button
            color="primary"
            sx={{ fontSize: "1.25rem" }}
            onClick={handleNext}
          >
            {currentQuestionIndex < questions.length - 1
              ? "次のクイズへ"
              : "結果を見る"}
            →
          </Button>
        </Dialog>
      ) : null}
      <div className={styles.choicesContainer}>
        {question.current!.choices.map((answer: string, index: number) => (
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
            color="blue"
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
