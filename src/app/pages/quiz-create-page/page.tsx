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
  IconButton,
  Paper,
  Popover,
  Snackbar,
  styled,
  Switch,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { AvatarChip } from "@/app/components/create/AvatarChip/page";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AddPhotoAlternate, Delete, QuestionMark } from "@mui/icons-material";

interface Question {
  question: string;
  choices: string[];
  correctAnswer: Number;
  description: String;
  title: String;
  userId: string;
  anonymity: boolean;
  _id: string | null;
  imgDelete: boolean;
}

interface User {
  _id: string;
  email: string;
  nickname: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState("");
  const [imgDelete, setImgDelete] = useState(false);
  const [imgHover, setImgHover] = useState(false);

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
    const handleBeforeUnload = (event: any) => {
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
    const formData = new FormData();
    const newquestion: Question = {
      title,
      question,
      choices: choicesFormat,
      correctAnswer,
      description,
      userId: user?._id || "",
      anonymity,
      _id: searchParams.get("id"),
      imgDelete,
    };
    formData.append("image", imgFile as File);
    formData.append("json", JSON.stringify(newquestion));
    axios.put("/api/quiz/update", formData);
  };

  const openAlert = (text: string[]) => {
    setAlertList(text);
    setOpenValidationAlert(text.length >= 1);
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
    console.log(newAlertlist);
    const isError = newAlertlist.length >= 1;
    openAlert(newAlertlist);
    return isError;
  };

  // idに値を入れた場合はクイズをダウンロードする
  const loadingQuestion = () => {
    const quizId = searchParams.get("id");
    if (quizId === "new") return;
    axios
      .get("/api/quiz/get", { params: { id: quizId } })
      .then((res) => res.data)
      .then(async (data) => {
        const quiz = data.quiz;
        setTitle(quiz.title);
        setQuestion(quiz.question);
        setDescription(quiz.description);
        setAnonymity(quiz.anonymity);
        const newChoices = quiz.choices.map((c: any, i: number) => ({
          choiced: i === quiz.correctAnswer,
          value: c,
        }));
        setChoices(newChoices);
        setImgSrc(quiz.img);
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
          <TitleTag title="タイトル">
            <p>投稿するクイズのタイトルを記入してください！</p>
            <p>最も大きく映るのでかっこいいやつをお願いします。</p>
          </TitleTag>
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
          <TitleTag title="問題文">
            <p>
              クイズの問題文をここに書いてください！初代ポケモンのバグや任意コード実行に関することならなんでも大歓迎です！
            </p>
            <p>
              ファイルサイズが{MAX_FILE_SIZE / (1024 * 1024)}
              MBまでの画像もアップロード可能です。
            </p>
          </TitleTag>
          <span className={styles.questionBox}>
            <div
              className={styles.imgBox}
              onMouseEnter={() => {
                setImgHover(true);
              }}
              onMouseLeave={() => {
                setImgHover(false);
              }}
            >
              {imgSrc ? <img className={styles.img} src={imgSrc}></img> : null}
              {imgSrc ? null : (
                <IconButton component="label" size="large">
                  <AddPhotoAlternate
                    className={styles.imgUploadBtn}
                    color="green"
                    fontSize="large"
                  />
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file: File | null = (e.target.files as FileList)[0];
                      if (!file) return;
                      if (!file.type.startsWith("image/")) {
                        openAlert(["画像ファイルのみアップロードできます。"]);
                        return;
                      }
                      if (file.size > MAX_FILE_SIZE) {
                        openAlert([
                          `ファイルサイズが大きすぎます！最大${
                            MAX_FILE_SIZE / (1024 * 1024)
                          }MBまでアップロードできます。`,
                        ]);
                        return;
                      }
                      setImgDelete(true);
                      setImgFile(file);
                      const reader = new FileReader();
                      reader.onload = () => {
                        setImgSrc(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </IconButton>
              )}
              {imgHover && imgSrc && (
                <IconButton
                  className={styles.imgDelBtn}
                  onClick={() => {
                    setImgDelete(true);
                    setImgFile(null);
                    setImgSrc("");
                  }}
                  color="red"
                >
                  <Delete fontSize="large" />
                </IconButton>
              )}
            </div>
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
          </span>

          <TitleTag title="選択肢">
            <p>
              ユーザーが選択する文章をここに書いてください！ボタンにチェックするとその選択肢が正解になります。
            </p>
            <p>最大で8つまで選択肢を増やすことができます。</p>
          </TitleTag>
          <ChoicesCreateContainer
            choices={choices}
            updateChoices={setChoices}
            validation={choicesValidation}
          />
          <TitleTag title="解説">
            <p>答え合わせした後に表示される解説を書いてください！</p>
            <p>楽しい解説お待ちしております。</p>
          </TitleTag>
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

function TitleTag({ title, children }: { title: string; children: ReactNode }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <span className={styles.titleTag}>
      <div className={styles.titleTagWrapper}>
        <h2 className={styles.titleTagH2}>{title}</h2>
        <div
          className={styles.titleTagHelp}
          onMouseEnter={(e) => {
            setAnchorEl(e.currentTarget);
          }}
          onMouseLeave={() => {
            setAnchorEl(null);
          }}
        >
          <QuestionMark fontSize="inherit" color={open ? "white" : "green"} />
        </div>
      </div>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        sx={{ pointerEvents: "none" }}
      >
        <div className={styles.titleTagChildren}>{children}</div>
      </Popover>
    </span>
  );
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
