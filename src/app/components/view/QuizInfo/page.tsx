import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardActionArea,
  CardContent,
  Divider,
} from "@mui/material";
import styles from "./style.module.css";
import { useEffect, useState } from "react";

export default function QuizInfo(props: any) {
  const question = props.question;
  const [openAnswer, setOpenAnswer] = useState(false);

  useEffect(() => {
    setOpenAnswer(false);
  }, [question]);

  return (
    <Card className={styles.card}>
      <CardActionArea
        onClick={() => {
          setOpenAnswer(!openAnswer);
        }}
      >
        <CardContent>
          <h2 className={styles.cardTitle}>{question.title}</h2>
          <span className={styles.cardHeader}>
            <span>
              投稿者:
              <span className={styles.primaryText}>
                {question.userName || "けつばん"}
              </span>
            </span>
            <span>
              出題数:
              <span className={styles.primaryText}>
                {question.answerCnt || 0}
              </span>
            </span>
            <span>
              正答率:
              <span className={styles.primaryText}>
                {(question.correctRate * 100).toFixed(1) || 0}%
              </span>
            </span>
          </span>
          <Divider />
          <p className={styles.question}>{question.question}</p>
          <div className={styles.choicesContainer}>
            {question.choices.map((c: any, i: number) => (
              <div
                className={`${styles.choice} ${
                  i === question.correctAnswer && openAnswer
                    ? styles.correctChoice
                    : ""
                }`}
                key={i}
              >
                <p>{c}</p>
              </div>
            ))}
          </div>
          <Accordion expanded={openAnswer} className={styles.description}>
            <AccordionSummary>解説</AccordionSummary>
            <AccordionDetails>{question.description}</AccordionDetails>
          </Accordion>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
