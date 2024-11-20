"use client";
import { Loading } from "@/app/components/common/Loading/page";
import { Title } from "@/app/components/common/Title/page";
import {
  Choice,
  ChoicesCreateContainer,
} from "@/app/components/create/ChoicesCreateContainer/page";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Paper,
  Snackbar,
  Switch,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { AvatarChip } from "@/app/components/create/AvatarChip/page";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Question {
  question: string;
  choices: string[];
  correctAnswer: Number;
  description: String;
  title: String;
  userId: string;
  anonymity: boolean;
  _id: string | null;
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

  const [openValidationAlert, setOpenValidationAlert] = useState(false);
  const [alertList, setAlertList] = useState<String[]>([]);

  const titleValidation = useValidation("タイトル", 30);
  const questionValidation = useValidation("問題文", 300);
  const descriptionValidation = useValidation("解説", 300);
  const choicesValidation = useValidation("選択肢", 20);

  const searchParams = useSearchParams();

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
    loadingQuestion();

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
    const correctAnswer = choices.findIndex((c) => c.choiced === true);
    const ok = validationCheckAll();
    setOpenValidationAlert(ok);
    if (ok) return;
    const choicesFormat: string[] = choices.map((c) => c.value);
    const newquestion: Question = {
      title,
      question,
      choices: choicesFormat,
      correctAnswer,
      description,
      userId: user?._id || "",
      anonymity,
      _id: searchParams.get("id"),
    };
    axios.put("/api/quiz/update", newquestion);
  };

  // すべてのバリデーションをチェックする
  const validationCheckAll = () => {
    interface ValidationGroup {
      validation: any;
      value: String;
    }
    const validations: ValidationGroup[] = [
      { validation: titleValidation, value: title },
      { validation: questionValidation, value: question },
      { validation: descriptionValidation, value: description },
    ];
    let newAlertlist: string[] = [];
    validations.forEach((v, i) => {
      if (v.validation.error(v.value))
        newAlertlist = [...newAlertlist, v.validation.helperText(v.value)];
      else if (v.value.length <= 0)
        newAlertlist = [
          ...newAlertlist,
          `${v.validation.title()}を入力してください`,
        ];
    });
    let choiceValidationErrorF = false,
      choiceNullErrorF = false; // バリデーションFと入力してくださいF
    choices.forEach((c: Choice, i: number) => {
      if (choicesValidation.error(c.value) && !choiceValidationErrorF) {
        newAlertlist = [
          ...newAlertlist,
          choicesValidation.helperText(c.value) as string,
        ];
        choiceValidationErrorF = true;
      }
      if (c.value.length <= 0 && !choiceNullErrorF) {
        newAlertlist = [
          ...newAlertlist,
          `入力していない${choicesValidation.title()}があります`,
        ];
        choiceNullErrorF = true;
      }
    });
    if (choices.findIndex((c) => c.choiced) === -1)
      newAlertlist = [...newAlertlist, "正解となる選択肢を一つ選んでください"];
    setAlertList(newAlertlist);
    console.log(newAlertlist);
    const isError = newAlertlist.length >= 1;
    setOpenValidationAlert(isError);
    return isError;
  };

  // idに値を入れた場合はクイズをダウンロードする
  const loadingQuestion = () => {
    const quizId = searchParams.get("id");
    if (quizId === "new") return;
    axios
      .get("/api/quiz/get", { params: { id: quizId } })
      .then((res) => res.data)
      .then((data) => {
        const quiz = data.quiz;
        console.log(data);
        setTitle(quiz.title);
        setQuestion(quiz.question);
        setDescription(quiz.description);
        setAnonymity(quiz.anonymity);
        const newChoices = quiz.choices.map((c: any, i: number) => ({
          choiced: i === quiz.correctAnswer,
          value: c,
        }));
        setChoices(newChoices);
      })
      .catch((error) => {
        console.error("クイズデータが取得できません", error);
      });
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <>
      <Title title="クイズをつくる" color="green" />
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
                    checked={anonymity}
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
              onClick={() => {
                const ok = validationCheckAll();
                setOpenCheckLog(!ok);
              }}
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
            <dt className={styles.chkDt}>投稿者:</dt>
            <dd className={styles.chkDd}>
              {anonymity ? "けつばん" : user.nickname}
            </dd>
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
          <Link href="/">
            <Button
              variant="contained"
              color="green"
              sx={{ color: "var(--bc-white)" }}
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              投稿
            </Button>
          </Link>
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

      {/* バリデーションに引っかかった時のアラート */}

      <Snackbar
        open={openValidationAlert}
        autoHideDuration={6000}
        onClose={() => setOpenValidationAlert(false)}
      >
        <Alert severity="error">
          {alertList.map((a: String, i: number) => (
            <p key={i}>{a}</p>
          ))}
        </Alert>
      </Snackbar>
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

  const getTitle = () => {
    return title;
  };

  return {
    error: isError,
    helperText: getHelperText,
    label: getLabel,
    title: getTitle,
  };
};
