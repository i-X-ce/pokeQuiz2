"use client";
import { Title } from "@/app/components/common/Title";
import QuizInfo from "@/app/components/view/QuizInfo";
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import styles from "./style.module.css";
import { Loading } from "@/app/components/common/Loading";
import { useRouter, useSearchParams } from "next/navigation";
import LoginDialog from "@/app/components/common/LoginDialog";

interface Question {
  _id: string;
  question: string;
  choices: string[];
  correctAnswer: Number;
  img?: String;
  answerCnt: Number;
  correctCnt: Number;
  description: String;
  userName?: String;
  title: String;
  isCorrect: boolean;
  choiceAnswer: number;
  userId: string;
}

const quizLimitPerPage = 20; // 1ページに入れるクイズの数

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // ページ数
  const [sortType, setSortType] = useState("newest");
  const searchParams = useSearchParams();
  const [order, setOrder] = useState("newest");
  const [openAlert, setOpneAlert] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const router = useRouter();

  const loadingQuestions = (index: number, size: number, sortType: String) => {
    const range = searchParams.get("range");
    axios
      .get("/api/quiz/get-count", {
        params: { range: range || "all" },
      })
      .then((res) => res.data)
      .then((data) => {
        setTotalPages(
          Math.floor(data / quizLimitPerPage) +
            (data % quizLimitPerPage > 0 ? 1 : 0)
        );
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get("/api/quiz/get-view", {
        params: {
          index,
          size,
          sortType,
          range: range || "all",
        },
      })
      .then((res) => res.data)
      .then((data) => {
        setQuestions([...data]);
      })
      .catch((error) => {
        console.log(error);
        setOpenLoginDialog(true);
      });
  };

  const handlePageChange = (value: number, sortType: string) => {
    setPage(value);
    setSortType(sortType);
    loadingQuestions(
      (value - 1) * quizLimitPerPage,
      quizLimitPerPage,
      sortType
    );
  };

  useEffect(() => {
    loadingQuestions(0, quizLimitPerPage, "newest");
  }, []);

  if (!questions)
    return (
      <>
        <Loading />
        <LoginDialog
          open={openLoginDialog}
          onClose={() => {
            router.push("/");
          }}
        />
      </>
    );

  return (
    <>
      <Title
        color="blue"
        title={
          (searchParams.get("range") === "mine" ? "じぶんの" : "みんなの") +
          "クイズをみる"
        }
      />
      <div className={styles.mainContent}>
        <span className={styles.center}>
          <FormControl>
            <InputLabel>並び替え</InputLabel>
            <Select
              defaultValue="newest"
              label="並び替え"
              onChange={(e) => {
                setOrder(e.target.value);
                handlePageChange(page, e.target.value);
              }}
            >
              <MenuItem value="newest">新しい順</MenuItem>
              <MenuItem value="oldest">古い順</MenuItem>
              <MenuItem value="rateHighest">正答率が高い順</MenuItem>
              <MenuItem value="rateLowest">正答率が低い順</MenuItem>
              <MenuItem value="answerHighest">出題数が多い順</MenuItem>
              <MenuItem value="answerLowest">出題数が少ない順</MenuItem>
            </Select>
          </FormControl>
        </span>
        <span className={styles.center}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, n: number) => {
              handlePageChange(n, sortType);
            }}
            color="blue"
          />
        </span>
        <div className={styles.cardContainer}>
          {questions?.map((q: Question, i: number) => (
            <QuizInfo
              key={i + page * quizLimitPerPage}
              question={q}
              handleLoading={() => {
                handlePageChange(page, order);
              }}
              handleAlert={() => {
                setOpneAlert(true);
              }}
            />
          ))}
        </div>
        <span className={styles.center}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, n: number) => {
              handlePageChange(n, sortType);
            }}
            color="blue"
          />
        </span>
      </div>

      <Snackbar
        open={openAlert}
        autoHideDuration={5000}
        onClose={() => {
          setOpneAlert(false);
        }}
      >
        <Alert variant="standard" severity="success">
          クイズを削除しました。
        </Alert>
      </Snackbar>
    </>
  );
}
