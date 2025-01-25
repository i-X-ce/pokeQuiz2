import { AutoAwesome, Close, PanoramaFishEye } from "@mui/icons-material";
import { IconButton, Pagination, Tooltip, useMediaQuery } from "@mui/material";
import styles from "./style.module.css";
import { useEffect, useState } from "react";
import DescriptionWrapper from "../../common/DescriptionWrapper";
import { SharingPopover } from "../../common/SharingPopover";

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
  evalutionText,
}: {
  questions: Question[];
  evalutionText: string;
}) {
  const [page, setPage] = useState(0);
  const [question, setQuestion] = useState<Question>();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    setQuestion(questions[0]);
  }, []);

  const handlePageChange = (_e: React.ChangeEvent<unknown>, page: number) => {
    setPage(page - 1);
    setQuestion(questions[page - 1]);
  };

  const styleColor = question?.isCorrect ? "var(--bc-red)" : "var(--bc-blue)";

  const shareUrl = () => {
    const url = new URL("/pages/quiz-page", location.href);
    url.searchParams.append("difficulty", "specific");
    url.searchParams.append("ids", questions.map((i) => i._id).join(","));
    const result =
      questions.length.toString() +
      questions.reduce((acc, q, i) => {
        return acc + ((q.isCorrect ? 1 : 0) << i);
      }, 0);
    url.searchParams.append("result", result);
    return url.toString();
  };

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
        <SharingPopover
          text={`結果は${questions.filter((q) => q.isCorrect).length}/${
            questions.length
          }でした！\r\n${evalutionText}\r\n`}
          url={shareUrl()}
        />
        {/* <span>
          <Tooltip title="リンクをコピー" arrow>
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(shareUrl());
              }}
            >
              <InsertLink />
            </IconButton>
          </Tooltip>
          <Tooltip title="Twitterで共有" arrow>
            <IconButton
              size="large"
              onClick={() => {
                const correctCnt = questions.filter((q) => q.isCorrect).length;
                shareOnTwitter(
                  `結果は${correctCnt}/${questions.length}でした！\r\n${evalutionText}\r\n`,
                  shareUrl()
                );
              }}
            >
              <Twitter />
            </IconButton>
          </Tooltip>
        </span> */}
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
              </div>
            ))}
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
            size={isSmallScreen ? "small" : "medium"}
          />
        </div>
      </div>
    </div>
  );
}
