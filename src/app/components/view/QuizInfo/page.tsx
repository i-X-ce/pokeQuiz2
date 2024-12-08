import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Popover,
  Skeleton,
} from "@mui/material";
import styles from "./style.module.css";
import { useEffect, useState } from "react";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/navigation";
import DescriptionWrapper from "../../common/DescriptionWrapper";

export default function QuizInfo(props: any) {
  const question = props.question;
  const [openAnswer, setOpenAnswer] = useState(false);
  const [moreAnchorEl, setMoreAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const openMore = Boolean(moreAnchorEl);
  const [openDelete, setOpenDelete] = useState(false);
  const handleLoading = props.handleLoading;
  const handleAlert = props.handleAlert;
  const router = useRouter();

  useEffect(() => {
    setOpenAnswer(false);
    setLoading(true);
  }, [question]);

  return (
    <Card className={styles.card}>
      <CardContent>
        <span className={styles.titleContainer}>
          <h2 className={styles.cardTitle}>{question.title}</h2>
          {question.isMe ? (
            <IconButton
              onClick={(e) => {
                setMoreAnchorEl(e.currentTarget);
              }}
            >
              <MoreVert />
            </IconButton>
          ) : null}
          <Popover
            open={openMore}
            anchorEl={moreAnchorEl}
            onClose={() => {
              setMoreAnchorEl(null);
            }}
          >
            <Button
              startIcon={<Edit />}
              color="blue"
              fullWidth
              onClick={() => {
                router.push(`/pages/quiz-create-page?id=${question._id}`);
              }}
            >
              編集
            </Button>
            <Button
              startIcon={<Delete />}
              color="red"
              fullWidth
              onClick={() => setOpenDelete(true)}
            >
              削除
            </Button>
          </Popover>
        </span>
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

        {question.img && loading && <Skeleton animation="wave" height={300} />}
        {question.img && (
          <div className={styles.imgWrapper}>
            <img
              onLoad={() => setLoading(false)}
              className={styles.questionImg}
              src={question.img}
              title={question.title}
              style={{ display: loading ? "none" : "" }}
            />
          </div>
        )}

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
              onClick={() => {
                setOpenAnswer(!openAnswer);
              }}
            >
              <p>{c}</p>
            </div>
          ))}
        </div>

        <Collapse in={openAnswer}>
          <DescriptionWrapper color="blue">
            <p className={styles.description}>{question.description}</p>
          </DescriptionWrapper>
        </Collapse>
      </CardContent>

      {/* 削除ダイアログ */}
      <Dialog
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setMoreAnchorEl(null);
        }}
      >
        <DialogTitle className={styles.deleteTitle}>クイズの削除</DialogTitle>
        <DialogContent>
          <p>削除を選択しました。一度削除したクイズは二度と復元できません。</p>
          <p>削除してもよろしいですか？</p>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="red"
            onClick={() => {
              setOpenDelete(false);
              setMoreAnchorEl(null);
            }}
          >
            キャンセル
          </Button>
          <Button
            variant="contained"
            color="red"
            onClick={() => {
              axios
                .delete("/api/quiz/delete", {
                  params: { id: question._id },
                })
                .then(() => {
                  handleLoading();
                  handleAlert();
                });
              setOpenDelete(false);
              setMoreAnchorEl(null);
            }}
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
