"use client";
import { Title } from "@/app/components/common/Title";
import QuizInfo from "@/app/components/view/QuizInfo";
import {
  Alert,
  Dialog,
  DialogContent,
  DialogContentText,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Slide,
  Snackbar,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { Loading } from "@/app/components/common/Loading";
import { useRouter, useSearchParams } from "next/navigation";
import LoginDialog from "@/app/components/common/LoginDialog";
import {
  Close,
  Face,
  Help,
  InsertLink,
  PlayArrow,
  Search,
  SupervisorAccount,
  Twitter,
} from "@mui/icons-material";
import shareOnTwitter from "@/app/lib/shareOnTwitter";
import { LoadingLight } from "@/app/components/common/LoadingLight";

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
  isMe: boolean;
  correctRate: number;
}

type Selected = { id: string; title: string };

const quizLimitPerPage = 20; // 1ページに入れるクイズの数

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // ページ数
  const [sortType, setSortType] = useState("newest");
  const searchParams = useSearchParams();
  const [order, setOrder] = useState("newest");
  const [openAlert, setOpneAlert] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const router = useRouter();
  const [pageRange, setPageRange] = useState("all");
  const [openFaild, setOpenFaild] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const decisionSearchQuery = useRef("");
  const allSize = useRef(0);
  const [selectedQs, setSelectedQs] = useState<Selected[]>([]);
  const [openLoadingLight, setOpenLoadingLight] = useState(false);

  const loadingQuestions = (
    index: number,
    size: number,
    sortType: string,
    isChangePage: boolean = false
  ) => {
    const range = searchParams.get("range");
    setPageRange(range || "all");

    if (!isChangePage) {
      index = 0;
      setPage(1);
    }
    const params: {
      index: number;
      size: number;
      sortType: string;
      range: string;
      searchQuery?: string;
    } = { index, size, sortType, range: range || "all" };
    if (decisionSearchQuery.current != "")
      params.searchQuery = decisionSearchQuery.current;
    setOpenLoadingLight(true);
    axios
      .get("/api/quiz/get-view", {
        params,
      })
      .then((res) => res.data)
      .then((data) => {
        setOpenLoadingLight(false);
        const totalPage =
          Math.floor(data.allSize / quizLimitPerPage) +
          (data.allSize % quizLimitPerPage > 0 ? 1 : 0);
        setTotalPages(totalPage);
        setQuestions([...data.questions]);
        allSize.current = data.allSize;
      })
      .catch((error) => {
        setOpenLoadingLight(false);
        console.log(error);
        if (range === "mine" && error.status === 403) setOpenLoginDialog(true);
        else setOpenFaild(true);
      });
  };

  const handlePageChange = (newPage: number, sortType: string) => {
    setPage(newPage);
    setSortType(sortType);
    loadingQuestions(
      (newPage - 1) * quizLimitPerPage,
      quizLimitPerPage,
      sortType,
      true
    );
  };

  const reLoadQuestions = (sortType: string) => {
    loadingQuestions(0, quizLimitPerPage, sortType, false);
  };

  const handleSelectedQs = (selectedQuestion: Selected) => {
    if (selectedQs?.some((i) => i.id === selectedQuestion.id)) {
      setSelectedQs(selectedQs.filter((i) => i.id !== selectedQuestion.id));
      return false;
    } else {
      if (selectedQs.length >= 5) return false;
      setSelectedQs([...selectedQs, selectedQuestion]);
      return true;
    }
  };

  const playURL: () => string = () => {
    const url = new URL("/pages/quiz-page", location.href);
    url.searchParams.append("difficulty", "specific");
    url.searchParams.append("ids", selectedQs.map((i) => i.id).join(","));
    return url.toString();
  };

  useEffect(() => {
    loadingQuestions(0, quizLimitPerPage, "newest");
  }, []);

  if (!questions)
    return (
      <>
        <Loading />
        <LoginDialog
          open={openLoginDialog}
          onClose={() => {
            router.push("/");
          }}
        />
        <Dialog open={openFaild} onClose={() => router.push("/")}>
          <Alert severity="error">エラーが発生しました。</Alert>
          <DialogContent>
            <DialogContentText>クイズを取得できません。</DialogContentText>
          </DialogContent>
        </Dialog>
      </>
    );

  return (
    <>
      <LoadingLight open={openLoadingLight} />
      <Title
        color="blue"
        title={
          (searchParams.get("range") === "mine" ? "じぶんの" : "みんなの") +
          "クイズをみる"
        }
      />
      <ToggleButtonGroup
        value={pageRange}
        exclusive
        color="blue"
        onChange={(_event, newValue) => {
          setPageRange(newValue);
          router.push("/pages/quiz-view?range=" + newValue);
        }}
      >
        <Tooltip title="みんなの">
          <ToggleButton
            value="all"
            component="a"
            href="/pages/quiz-view?range=all"
          >
            <SupervisorAccount />
          </ToggleButton>
        </Tooltip>

        <Tooltip title="じぶんの">
          <ToggleButton
            value="mine"
            component="a"
            href="/pages/quiz-view?range=mine"
          >
            <Face />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>

      <div className={styles.mainContent}>
        <span className={styles.center + " " + styles.topInput}>
          <FormControl>
            <InputLabel>並び替え</InputLabel>
            <Select
              defaultValue="newest"
              label="並び替え"
              onChange={(e) => {
                setOrder(e.target.value);
                handlePageChange(page, e.target.value);
              }}
            >
              <MenuItem value="newest">新しい順</MenuItem>
              <MenuItem value="oldest">古い順</MenuItem>
              <MenuItem value="rateHighest">正答率が高い順</MenuItem>
              <MenuItem value="rateLowest">正答率が低い順</MenuItem>
              <MenuItem value="answerHighest">出題数が多い順</MenuItem>
              <MenuItem value="answerLowest">出題数が少ない順</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="standard"
            slotProps={{
              input: {
                startAdornment: (
                  <Tooltip title="検索">
                    <IconButton
                      onClick={() => {
                        let q: string = "";
                        setSearchQuery((s) => (q = s));
                        decisionSearchQuery.current = q;
                        reLoadQuestions(sortType);
                      }}
                    >
                      <Search />
                    </IconButton>
                  </Tooltip>
                ),
                endAdornment: (
                  <Tooltip title="クリア">
                    <IconButton
                      onClick={() => {
                        setSearchQuery("");
                        decisionSearchQuery.current = "";
                      }}
                      sx={{
                        color: searchQuery === "" ? "transparent" : "",
                        pointerEvents: searchQuery === "" ? "none" : "",
                      }}
                    >
                      <Close />
                    </IconButton>
                  </Tooltip>
                ),
              },
            }}
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                decisionSearchQuery.current = searchQuery;
                reLoadQuestions(sortType);
              }
            }}
            sx={{ margin: "0 var(--space-md)" }}
          ></TextField>
        </span>
        {allSize.current !== 0 ? (
          <>
            <span className={styles.center}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_e, n: number) => {
                  handlePageChange(n, sortType);
                }}
                color="blue"
              />
            </span>
            <div className={styles.cardContainer}>
              {questions?.map((q: Question, i: number) => (
                <QuizInfo
                  key={i + page * quizLimitPerPage}
                  question={q}
                  handleLoading={() => {
                    handlePageChange(page, order);
                  }}
                  handleAlert={() => {
                    setOpneAlert(true);
                  }}
                  handleSelectedQs={handleSelectedQs}
                  selected={selectedQs?.some((i) => i.id === q._id)}
                />
              ))}
            </div>
            <span className={styles.center}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_e, n: number) => {
                  handlePageChange(n, sortType);
                }}
                color="blue"
              />
            </span>
          </>
        ) : (
          <div className={styles.allsizeError}>
            <Alert severity="error">クイズが見つかりません！</Alert>
          </div>
        )}
      </div>

      <Snackbar
        open={openAlert}
        autoHideDuration={5000}
        onClose={() => {
          setOpneAlert(false);
        }}
      >
        <Alert variant="standard" severity="success">
          クイズを削除しました。
        </Alert>
      </Snackbar>

      <Slide in={selectedQs.length >= 1} direction="up">
        <div className={styles.selectedTab}>
          <div className={styles.selectedTabButtons}>
            <Tooltip title="クイズをとく" arrow placement="top">
              <IconButton onClick={() => router.push(playURL())}>
                <PlayArrow />
              </IconButton>
            </Tooltip>
            <span>
              <Tooltip title="リンクをコピー" arrow placement="top">
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(playURL());
                  }}
                >
                  <InsertLink />
                </IconButton>
              </Tooltip>
              <Tooltip title="Twitterで共有" arrow placement="top">
                <IconButton
                  onClick={() => {
                    shareOnTwitter("オススメのバグクイズです！！", playURL());
                  }}
                >
                  <Twitter />
                </IconButton>
              </Tooltip>
            </span>
          </div>
          <Divider />
          <div className={styles.selectedQuestions}>
            {[...Array(5)].map((_, i) => (
              <Tooltip
                key={i}
                title={i < selectedQs.length ? selectedQs[i].title : "未選択"}
                arrow
              >
                <IconButton
                  onClick={() => {
                    if (i >= selectedQs.length) return;
                    handleSelectedQs(selectedQs[i]);
                  }}
                  color={i < selectedQs.length ? "blue" : "default"}
                >
                  <Help />
                </IconButton>
              </Tooltip>
            ))}
            <Tooltip title="クリア" arrow>
              <IconButton
                onClick={() => {
                  setSelectedQs([]);
                }}
              >
                <Close />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Slide>
    </>
  );
}
