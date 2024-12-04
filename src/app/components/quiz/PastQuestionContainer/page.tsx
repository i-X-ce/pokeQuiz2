import { Close, ExpandMore, PanoramaFishEye } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Pagination,
  SelectChangeEvent,
} from "@mui/material";
import styles from "./style.module.css";
import { ChangeEvent, useEffect, useState } from "react";

interface Question {
  _id: string;
  question: string;
  choices: string[];
  correctAnswer: number;
  img?: string;
  answerCnt: number;
  correctCnt: number;
  description: string;
  userName?: string;
  title: string;
  isCorrect: boolean;
  choiceAnswer: number;
  userId: string;
}

export default function PastQuestionContainer(props: any) {
  const [page, setPage] = useState(0);
  const [question, setQuestion] = useState<Question>();
  const questions: Question[] = props.questions;

  useEffect(() => {
    setQuestion(questions[0]);
  }, []);

  const handlePageChange = (n: number) => {
    setPage(n - 1);
    setQuestion(questions[n - 1]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.correctIcons}>
        {questions.map((q: any, i: number) => (
          <IconButton
            onClick={() => {
              handlePageChange(i + 1);
            }}
          >
            {q.isCorrect ? (
              <PanoramaFishEye
                key={i}
                sx={{ fontSize: "2.3rem" }}
                color="red"
              />
            ) : (
              <Close key={i} sx={{ fontSize: "2.3rem" }} color="blue" />
            )}
          </IconButton>
        ))}
      </div>
      <div className={styles.questionContainer}>
        <div
          className={
            styles.titleContainer +
            " " +
            (question?.isCorrect ? styles.redBg : styles.blueBg)
          }
        >
          <div className={styles.title}>
            <p>
              Q{page + 1}.{question?.title}
            </p>
          </div>
        </div>
        <div className={styles.questionSmallContainers}>
          <div className={styles.questionQuestion}>
            {question?.img ? (
              <img src={question.img} className={styles.img} />
            ) : null}
            <div className={styles.questionText}>{question?.question}</div>
          </div>
          <div className={styles.choiceContainer}>
            <span className={styles.choiceSet}>
              <div>あなた</div>
              <div className={styles.choice + " " + styles.redBg}>
                {question?.choices[question.choiceAnswer]}
              </div>
            </span>
            <span className={styles.choiceSet}>
              <div>答え</div>
              <div className={styles.choice + " " + styles.greenBg}>
                {question?.choices[question.correctAnswer]}
              </div>
            </span>
          </div>
          <div className={styles.description}>{question?.description}</div>
          <Pagination
            count={questions.length}
            onChange={(e, n) => handlePageChange(n)}
            color="blue"
          />
        </div>
      </div>
      {/* {questions.map((q: any, i: number) => (
        <Accordion key={i}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <span className={styles.titleContainer}>
              <div className={styles.title}>
                <span className={styles.qNumber}>Q.{i} </span>
                <span>{q.title}</span>
              </div>
              {q.isCorrect ? (
                <PanoramaFishEye sx={{ fontSize: "2.3rem" }} color="red" />
              ) : (
                <Close sx={{ fontSize: "2.3rem" }} color="blue" />
              )}
            </span>
          </AccordionSummary>
          <AccordionDetails>
            <div className={styles.answerContainer}>
              <div className={styles.columnWrapper}>
                <p>あなたの回答</p>
                <div className={`${styles.pastAnswer} ${styles.yourAnswer}`}>
                  {q.choices[q.choiceAnswer]}
                </div>
              </div>
              <div className={styles.columnWrapper}>
                <p>答え</p>
                <div className={`${styles.pastAnswer} ${styles.correctAnswer}`}>
                  {q.choices[q.correctAnswer]}
                </div>
              </div>
              <div>{q.description}</div>
            </div>
          </AccordionDetails>
        </Accordion>
      ))} */}
    </div>
  );
}
