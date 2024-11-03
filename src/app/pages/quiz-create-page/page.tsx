"use client";
import { Loading } from "@/app/components/common/Loading/page";
import { Title } from "@/app/components/common/Title/page";
import {
  Choice,
  ChoicesCreateContainer,
} from "@/app/components/create/ChoicesCreateContainer/page";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { AvatarChip } from "@/app/components/create/AvatarChip/page";

interface Question {
  question: string;
  choices: string[];
  correctAnswer: Number;
  description: String;
  title: String;
  userId: string;
  anonymity: boolean;
}

interface User {
  _id: string;
  email: string;
  nickname: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [choices, setChoices] = useState<Choice[]>([
    { choiced: false, value: "" },
    { choiced: false, value: "" },
  ]);
  const [anonymity, setAnonymity] = useState(false);
  const [user, setUser] = useState<User>();

  const [openCheckLog, setOpenCheckLog] = useState(false);
  const [openCnancelLog, setOpenCancelLog] = useState(false);
  const [isAllowToanvigate, setIsAllowToNavigate] = useState(false);

  const titleValidation = useValidation("タイトル", 30);
  const questionValidation = useValidation("問題文", 300);
  const descriptionValidation = useValidation("解説", 300);
  const choicesValidation = useValidation("選択肢", 20);

  useEffect(() => {
    axios
      .get("/api/user/get", {
        params: { email: session?.user?.email, otherParam: "value" },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        console.error("ユーザーデータが取得できません", error);
      });

    // ページの移動があると警告を出す
    const handleBeforeUnload = (event) => {
      if (isAllowToanvigate) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isAllowToanvigate]);

  // submit時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctAnswer = choices.findIndex((c) => c.choiced === true);
    if (correctAnswer === -1 || validationCheckAll()) return;
    const choicesFormat: string[] = choices.map((c) => c.value);
    const newquestion: Question = {
      title,
      question,
      choices: choicesFormat,
      correctAnswer,
      description,
      userId: user?._id || "",
      anonymity,
    };
    axios.put("/api/quiz/update", newquestion);
  };

  // すべてのバリデーションをチェックする
  const validationCheckAll = () => {
    // const ok =
    //   titleValidation.current.lastError(title) &&
    //   questionValidation.current.lastError(question) &&
    //   descriptionValidation.current.lastError(description);
    // setTitle(title); // 強制的に再レンダリング
    // return ok;
  };

  if (!user) {
    return <Loading />;
  }

  fetch;
  return (
    <>
      <Title title="クイズを作る" color="green" />
      <Paper className={styles.paper} elevation={5}>
        <form action="" method="post" onSubmit={handleSubmit}>
          <span className={styles.titleAndName}>
            <TextField
              required
              fullWidth
              error={titleValidation.error(title)}
              label={titleValidation.label(title)}
              helperText={titleValidation.helperText(title)}
              placeholder="こんにちは"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              color="green"
            />
            <span className={styles.nameContainer}>
              <AvatarChip anonymity={anonymity} userName={user.nickname} />
              <FormControlLabel
                control={
                  <Switch
                    onChange={(e) => setAnonymity(e.target.checked)}
                    color="green"
                  />
                }
                label="匿名"
                labelPlacement="top"
              />
            </span>
          </span>
          <TextField
            fullWidth
            required
            error={questionValidation.error(question)}
            label={questionValidation.label(question)}
            helperText={questionValidation.helperText(question)}
            multiline
            minRows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            color="green"
          />
          <ChoicesCreateContainer
            choices={choices}
            updateChoices={setChoices}
            validation={choicesValidation}
          />
          <TextField
            fullWidth
            required
            error={descriptionValidation.error(description)}
            label={descriptionValidation.label(description)}
            helperText={descriptionValidation.helperText(description)}
            multiline
            minRows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            color="green"
            sx={{ marginBottom: "20px" }}
          />
          <span className={styles.submitButtons}>
            <Button
              variant="outlined"
              color="green"
              size="large"
              onClick={() => setOpenCancelLog(true)}
            >
              やめる
            </Button>
            <Button
              onClick={() => setOpenCheckLog(true)}
              variant="contained"
              color="green"
              size="large"
              sx={{ color: "var(--bc-white)", marginLeft: "20px" }}
            >
              次へ
            </Button>
          </span>
        </form>
      </Paper>

      {/* 確認ダイアログ */}
      <Dialog open={openCheckLog} onClose={() => setOpenCheckLog(false)}>
        <DialogTitle>問題の確認</DialogTitle>
        <DialogContent>
          <DialogContentText>
            以下の内容で投稿します。よろしいですか？
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
          <dl className={styles.chkDl}>
            <dt className={styles.chkDt}>タイトル:</dt>
            <dd className={styles.chkDd}>{title}</dd>
            <dt className={styles.chkDt}>問題:</dt>
            <dd className={styles.chkDd}>{question}</dd>
            <dt className={styles.chkDt}>選択肢:</dt>
            <dd className={styles.chkDd}>
              {choices.map((c: Choice, i: number) => (
                <div key={i}>{c.value}</div>
              ))}
            </dd>
            <dt className={styles.chkDt}>答え:</dt>
            <dd className={styles.chkDd}>
              {
                choices[
                  Math.max(
                    0,
                    choices.findIndex((c) => c.choiced === true)
                  )
                ].value
              }
            </dd>
            <dt className={styles.chkDt}>説明:</dt>
            <dd className={styles.chkDd}>{description}</dd>
          </dl>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="green"
            onClick={() => setOpenCheckLog(false)}
          >
            キャンセル
          </Button>
          <Button
            variant="contained"
            color="green"
            sx={{ color: "var(--bc-white)" }}
          >
            投稿
          </Button>
        </DialogActions>
      </Dialog>

      {/* やめるダイアログ */}
      <Dialog open={openCnancelLog} onClose={() => setOpenCancelLog(false)}>
        <DialogTitle>ちょっと待って！</DialogTitle>
        <DialogContent>
          <DialogContentText>
            フアイルのデータ(入力したデータ)をクリアしてホームへ戻ります。よろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="green" onClick={() => setOpenCancelLog(false)}>
            いいえ
          </Button>
          <Button
            color="green"
            component="a"
            href="/"
            onClick={() => {
              setIsAllowToNavigate(true);
            }}
          >
            はい
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export const useValidation = (title: string, maxLength: number) => {
  //表示上エラーになっている
  const isError = (value: string) => {
    return value.length > maxLength;
  };

  const getHelperText = (value: string) => {
    if (!isError(value)) return null;
    return isError(value)
      ? `${title}は${maxLength}字以内で入力してください。`
      : null;
  };

  const getLabel = (value: string) => {
    return `${title} (${value.length}/${maxLength})`;
  };

  return {
    error: isError,
    helperText: getHelperText,
    label: getLabel,
  };
};
