import {
  Close,
  ExpandMore,
  PanoramaFishEye,
  TripOrigin,
} from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import styles from "./style.module.css";

export default function PastQuestionContainer(props: any) {
  const questions: any = props.questions;
  return (
    <div className={styles.container}>
      {questions.map((q: any, i: number) => (
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
      ))}
    </div>
  );
}
