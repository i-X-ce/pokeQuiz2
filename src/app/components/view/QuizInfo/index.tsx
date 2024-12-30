import React, { useEffect, useState } from "react";
import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Popover,
  Skeleton,
  Tooltip,
} from "@mui/material";
import styles from "./style.module.css";
import { Delete, Edit, MoreVert, Twitter } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/navigation";
import DescriptionWrapper from "../../common/DescriptionWrapper";

export default function QuizInfo({
  question,
  handleSelectedQs: handleSelectedIds,
  handleLoading,
  handleAlert,
  selected,
}: {
  question: any;
  handleSelectedQs: (selectedQuestion: any) => boolean;
  handleLoading: () => void;
  handleAlert: () => void;
  selected: boolean;
}) {
  const [openAnswer, setOpenAnswer] = useState(false);
  const [moreAnchorEl, setMoreAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const openMore = Boolean(moreAnchorEl);
  const [openDelete, setOpenDelete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setOpenAnswer(false);
    setLoading(true);
  }, [question]);

  return (
    <>
      <div
        className={styles.card + (selected ? " " + styles.selectedCard : "")}
        onClick={(e) => {
          const ok: boolean = handleSelectedIds({
            id: question._id,
            title: question.title,
          });
          // setSelected(ok);
        }}
      >
        <span className={styles.titleContainer}>
          <h2 className={styles.cardTitle}>{question.title}</h2>
          {question.isMe && (
            <span className={styles.iconContainer}>
              <Tooltip title="オプション">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMoreAnchorEl(e.currentTarget);
                  }}
                >
                  <MoreVert />
                </IconButton>
              </Tooltip>
            </span>
          )}
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
      </div>

      <span className={styles.absoluteContainer}>
        <Popover
          className={styles.popover}
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

        <Dialog
          open={openDelete}
          onClose={() => {
            setOpenDelete(false);
            setMoreAnchorEl(null);
          }}
        >
          <DialogTitle className={styles.deleteTitle}>クイズの削除</DialogTitle>
          <DialogContent>
            <p>
              削除を選択しました。一度削除したクイズは二度と復元できません。
            </p>
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
      </span>
    </>
  );
}
