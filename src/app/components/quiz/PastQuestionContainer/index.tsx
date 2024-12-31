import {
  AutoAwesome,
  Close,
  PanoramaFishEye,
  Twitter,
} from "@mui/icons-material";
import { IconButton, Pagination, Tooltip } from "@mui/material";
import styles from "./style.module.css";
import { useEffect, useState } from "react";
import DescriptionWrapper from "../../common/DescriptionWrapper";
import shareOnTwitter from "@/app/lib/shareOnTwitter";

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

export default function PastQuestionContainer({
  questions,
}: {
  questions: Question[];
}) {
  const [page, setPage] = useState(0);
  const [question, setQuestion] = useState<Question>();

  useEffect(() => {
    setQuestion(questions[0]);
  }, []);

  const handlePageChange = (_e: React.ChangeEvent<unknown>, page: number) => {
    setPage(page - 1);
    setQuestion(questions[page - 1]);
  };

  const styleColor = question?.isCorrect ? "var(--bc-red)" : "var(--bc-blue)";

  return (
    <div className={styles.container}>
      <span className={styles.iconHeader}>
        <div className={styles.correctIcons}>
          {questions.map((q: Question, i: number) => (
            <Tooltip key={i} title={`Q${i + 1}.${questions[i].title}`} arrow>
              <IconButton
                onClick={(e) => {
                  handlePageChange(e, i + 1);
                }}
              >
                {q.isCorrect ? (
                  <PanoramaFishEye
                    sx={{ fontSize: "var(--font-size-xxxl)" }}
                    color="red"
                  />
                ) : (
                  <Close
                    key={i}
                    sx={{ fontSize: "var(--font-size-xxxl)" }}
                    color="blue"
                  />
                )}
              </IconButton>
            </Tooltip>
          ))}
        </div>
        <Tooltip title="Twitterで共有" arrow>
          <IconButton
            size="large"
            onClick={() => {
              const url = new URL("/pages/quiz-page", location.href);
              url.searchParams.append("difficulty", "specific");
              url.searchParams.append(
                "ids",
                questions.map((i) => i._id).join(",")
              );
              const result = questions
                .map((q) => (q.isCorrect ? "○" : "×"))
                .join("");
              const correctCnt = questions.filter((q) => q.isCorrect).length;
              shareOnTwitter(
                `結果は${correctCnt}/${questions.length}でした！\r\n${result}だったよ！`,
                url.toString()
              );
            }}
          >
            <Twitter />
          </IconButton>
        </Tooltip>
      </span>
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
          <div className={styles.choices}>
            {question?.choices.map((c: string, i: number) => (
              <div
                key={i}
                className={styles.choice}
                style={{
                  color:
                    question.choiceAnswer === i
                      ? "var(--bc-white)"
                      : styleColor,
                  backgroundColor:
                    question.choiceAnswer === i
                      ? styleColor
                      : "var(--bc-white)",
                }}
              >
                {question.correctAnswer === i && <AutoAwesome />}
                {c}
                {/* {c + (question.correctAnswer === i ? "(正解)" : "")} */}
              </div>
            ))}
            {/* <span className={styles.choiceSet}>
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
            </span> */}
          </div>
          <DescriptionWrapper
            className={styles.descriptionWrapper}
            color={question?.isCorrect ? "red" : "blue"}
          >
            <div className={styles.description}>{question?.description}</div>
          </DescriptionWrapper>
          <Pagination
            sx={{ alignSelf: "center" }}
            count={questions.length}
            onChange={handlePageChange}
            page={page + 1}
            color={question?.isCorrect ? "red" : "blue"}
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
