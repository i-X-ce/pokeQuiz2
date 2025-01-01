"use client";
import { Loading } from "@/app/components/common/Loading";
import { Title } from "@/app/components/common/Title";
import {
  Choice,
  ChoicesCreateContainer,
} from "@/app/components/create/ChoicesCreateContainer";
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
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";
import styles from "./style.module.css";
import { AvatarChip } from "@/app/components/create/AvatarChip";
import { useRouter, useSearchParams } from "next/navigation";
import { AddPhotoAlternate, Delete, QuestionMark } from "@mui/icons-material";
import LoginDialog from "@/app/components/common/LoginDialog";
import DescriptionWrapper from "@/app/components/common/DescriptionWrapper";
import { useValidation } from "@/hooks/useValidation";
import { LoadingLight } from "@/app/components/common/LoadingLight";

interface Question {
  question: string;
  choices: string[];
  correctAnswer: number;
  description: string;
  title: string;
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 画像ファイルサイズの限度
const FILE_ACCEPT = ".jpg,.png,.bmp,.tiff,.gif"; // アップロードできる拡張子

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
  const [openUploadSuccess, setOpenUploadSuccess] = useState(false);
  const [openUploadFailed, setOpenUploadFailed] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [openLoadingLight, setOpenLoadingLight] = useState(false);

  const [openValidationAlert, setOpenValidationAlert] = useState(false);
  const [alertList, setAlertList] = useState<string[]>([]);

  const titleValidation = useValidation("タイトル", 30);
  const questionValidation = useValidation("問題文", 300);
  const descriptionValidation = useValidation("解説", 300);
  const choicesValidation = useValidation("選択肢", 20);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/user/get", {
        params: { email: session?.user?.email },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        console.error("ユーザーデータが取得できません", error);
        setOpenLoginDialog(true);
      });
    loadingQuestion();

    // ページの移動があると警告を出す
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
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
  const handleSubmit = () => {
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
    setOpenLoadingLight(true);
    setOpenCheckLog(false);
    axios
      .put("/api/quiz/update", formData)
      .then(() => {
        setOpenLoadingLight(false);
        setOpenUploadSuccess(true);
      })
      .catch(() => {
        setOpenLoadingLight(false);
        setOpenUploadFailed(true);
      });
  };

  const openAlert = (text: string[]) => {
    setAlertList(text);
    setOpenValidationAlert(text.length >= 1);
  };

  // すべてのバリデーションをチェックする
  const validationCheckAll = () => {
    interface ValidationGroup {
      // eslint-disable-next-line
      validation: any;
      value: string;
    }
    const validations: ValidationGroup[] = [
      { validation: titleValidation, value: title },
      { validation: questionValidation, value: question },
      { validation: descriptionValidation, value: description },
    ];
    let newAlertlist: string[] = [];
    validations.forEach((v) => {
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
    choices.forEach((c: Choice) => {
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
    setOpenLoadingLight(true);
    axios
      .get("/api/quiz/get", { params: { id: quizId } })
      .then((res) => res.data)
      .then(async (data) => {
        setOpenLoadingLight(false);
        const quiz = data.quiz;
        setTitle(quiz.title);
        setQuestion(quiz.question);
        setDescription(quiz.description);
        setAnonymity(quiz.anonymity);
        const newChoices = quiz.choices.map((c: string, i: number) => ({
          choiced: i === quiz.correctAnswer,
          value: c,
        }));
        setChoices(newChoices);
        setImgSrc(quiz.img);
      })
      .catch((error) => {
        setOpenLoadingLight(false);
        setOpenErrorDialog(true);
        console.error("クイズデータが取得できません", error);
      });
  };

  if (!user) {
    return (
      <>
        <Loading />
        <LoginDialog
          open={openLoginDialog}
          onClose={() => {
            router.push("/");
          }}
        />
      </>
    );
  }

  return (
    <>
      <Title title="クイズをつくる" color="green" />
      <Paper className={styles.paper} elevation={5}>
        <form
          action=""
          method="post"
          onSubmit={handleSubmit}
          style={{ position: "relative", padding: "0.1px" }}
        >
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
          <TitleTag title="タイトル">
            <p>投稿するクイズのタイトルを書いてください！</p>
            <p>
              最も大きく映るのでかっこいいよくて関連性のあるものをお願いします。
            </p>
            <p>
              また、匿名ボタンにチェックすると匿名でクイズを投稿することができます。
            </p>
          </TitleTag>

          <span className={styles.titleAndName}>
            <TextField
              required
              fullWidth
              error={titleValidation.error(title)}
              label={titleValidation.label(title)}
              helperText={titleValidation.helperText(title)}
              placeholder="例) なかよしバッヂのジャンプ先"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              color="green"
            />
          </span>
          <TitleTag title="問題文">
            <p>クイズの問題文をここに書いてください！</p>
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
                  <Tooltip title="画像をアップロード">
                    <AddPhotoAlternate
                      className={styles.imgUploadBtn}
                      color="green"
                      fontSize="large"
                    />
                  </Tooltip>

                  <VisuallyHiddenInput
                    type="file"
                    accept={FILE_ACCEPT}
                    onChange={(e) => {
                      const file: File | null = (e.target.files as FileList)[0];
                      if (!file) return;
                      const extnames = FILE_ACCEPT.split(",");
                      let permit = false;
                      extnames.forEach((extname) => {
                        const fileExt = "." + file.name.split(".").pop();
                        if (fileExt === extname) {
                          permit = true;
                        }
                      });
                      if (!permit) {
                        openAlert([
                          `決められた拡張子(${FILE_ACCEPT})の画像ファイルのみアップロードできます。`,
                        ]);
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
                <Tooltip title="画像を削除">
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
                </Tooltip>
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
              placeholder="例) なかよしバッヂのジャンプ先アドレスのメモリの役割のうち、正しいのはどれでしょう？"
            />
          </span>

          <TitleTag title="選択肢">
            <p>ユーザーが選択する文章をここに書いてください！</p>
            <p>ボタンにチェックするとその選択肢が正解になります。</p>
            <p>最大で8つまで選択肢を増やすことができます。</p>
          </TitleTag>
          <ChoicesCreateContainer
            choices={choices}
            updateChoices={setChoices}
            validation={{
              ...choicesValidation,
              helperText: (value: string) =>
                choicesValidation.helperText(value) ?? "",
            }}
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
            placeholder="例) なかよしバッヂはサファリボールの残り個数のアドレスにジャンプします。このメモリや、次のメモリに未定義命令など、フリーズする可能性のある命令が入ると困るので必ずサファリボールの個数を調整してからなかよしバッヂを使いましょう。"
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
        <DialogContentText sx={{ padding: "10px 20px" }}>
          以下の内容で投稿します。よろしいですか？
        </DialogContentText>
        <Divider />
        <div className={styles.checkContainer}>
          <div className={styles.checkUser}>
            投稿者:{anonymity ? "けつばん" : user.nickname}
          </div>
          <div className={styles.checkTitle}>{title}</div>
          <div className={styles.checkQuestion}>
            {imgSrc && <img src={imgSrc} className={styles.checkImg}></img>}
            {question}
          </div>
          <div className={styles.checkChoices}>
            {choices.map((c: Choice, i: number) => (
              <div
                key={i}
                className={
                  styles.checkChoice +
                  (c.choiced ? " " + styles.checkChoiceCorrect : "")
                }
              >
                {c.value}
              </div>
            ))}
          </div>
          <DescriptionWrapper color="green">
            <div className={styles.checkDescription}>{description}</div>
          </DescriptionWrapper>
        </div>

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
            onClick={() => {
              handleSubmit();
            }}
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

      {/* バリデーションに引っかかった時のアラート */}

      <Snackbar
        open={openValidationAlert}
        autoHideDuration={6000}
        onClose={() => setOpenValidationAlert(false)}
      >
        <Alert severity="error">
          {alertList.map((a: string, i: number) => (
            <p key={i}>{a}</p>
          ))}
        </Alert>
      </Snackbar>

      <Dialog
        open={openUploadSuccess}
        onClose={() => {
          setOpenUploadSuccess(false);
          router.push("/");
        }}
      >
        <DialogTitle color="green">投稿完了</DialogTitle>
        <DialogContent>
          クイズの投稿ができました！ホームに戻ります。
        </DialogContent>
        <DialogActions>
          <Button
            color="green"
            variant="contained"
            onClick={() => {
              setOpenUploadSuccess(false);
              router.push("/");
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openUploadFailed}
        onClose={() => {
          setOpenUploadFailed(false);
          setOpenCheckLog(false);
        }}
      >
        <DialogTitle color="red">投稿失敗</DialogTitle>
        <DialogContent>
          クイズの投稿に失敗しました…。少し時間を置いてお試しください。
          症状が治らなければア▶イスにご連絡ください。
        </DialogContent>
      </Dialog>

      <Dialog
        open={openErrorDialog}
        onClose={() => {
          router.push("/");
          setOpenErrorDialog(false);
        }}
      >
        <Alert severity="error">
          クイズデータを取得できませんでした。もう一度お試しください。
        </Alert>
      </Dialog>
      <LoadingLight open={openLoadingLight} />
    </>
  );
}

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
