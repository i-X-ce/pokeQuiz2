"use client";
import { Title } from "@/app/components/common/Title/page";
import QuizInfo from "@/app/components/view/QuizInfo/page";
import { Pagination } from "@mui/material";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";

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

const quizLimitPerPage = 20; // 1ページに入れるクイズの数

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // ページ数

  const loadingQuestions = (index: number, size: number, sortType: String) => {
    axios
      .get("/api/quiz/get-view", {
        params: {
          index,
          size,
          sortType,
        },
      })
      .then((res) => res.data)
      .then((data) => {
        setQuestions(data);
      });
  };

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    loadingQuestions(
      (value - 1) * quizLimitPerPage,
      quizLimitPerPage,
      "newest"
    );
  };

  useEffect(() => {
    loadingQuestions(0, quizLimitPerPage, "newest");
    axios
      .get("/api/quiz/get-count")
      .then((res) => res.data)
      .then((data) => {
        setTotalPages(
          Math.floor(data / quizLimitPerPage) +
            (data % quizLimitPerPage > 0 ? 1 : 0)
        );
      });
  }, []);

  return (
    <>
      <Title color="blue" title="クイズを見る" />
      <Pagination count={totalPages} page={page} onChange={handlePageChange} />
      {questions?.map((q: Question, i: number) => (
        <QuizInfo key={i} question={q} />
      ))}
    </>
  );
}
