"use client";
import styles from "./style.module.css";
import Link from "next/link";
import LoginBtn from "./components/common/loginChip";
import { NickNameInput } from "./components/common/NickNameInput";
import { Button } from "@mui/material";
import axios from "axios";
import { HomeTitle } from "./components/common/HomeTitle";
import { HomeButton } from "./components/common/HomeButton";
import {
  AddBox,
  Face,
  HelpCenter,
  SentimentDissatisfied,
  SentimentSatisfiedAlt,
  SupervisorAccount,
  ViewModule,
  WorkspacePremium,
} from "@mui/icons-material";
import { ChildButton } from "./components/common/ChildButton";

export default function Home() {
  const setDifficulty = (difficulty: string) => {
    localStorage.setItem("difficulty", difficulty);
  };

  return (
    <>
      <HomeTitle />
      <div className={styles.buttonContainer}>
        <HomeButton
          color={"red"}
          title={"クイズをとく"}
          startIcon={<HelpCenter />}
        >
          <span className={styles.childButtonContainer}>
            <ChildButton
              title={"むずかしい"}
              startIcon={<SentimentDissatisfied />}
              link={"/pages/quiz-page"}
              color={"red"}
            />
            <ChildButton
              title={"かんたん"}
              startIcon={<SentimentSatisfiedAlt />}
              link={"/pages/quiz-page"}
              color={"red"}
            />
          </span>
        </HomeButton>
        <HomeButton
          color={"green"}
          title={"クイズをつくる"}
          startIcon={<AddBox />}
          link="/pages/quiz-create-page"
        />

        <HomeButton
          color={"blue"}
          title={"クイズをみる"}
          startIcon={<ViewModule />}
        >
          <span className={styles.childButtonContainer}>
            <ChildButton
              title={"みんなのクイズ"}
              startIcon={<SupervisorAccount />}
              link={"/pages/quiz-view"}
              color={"blue"}
            />
            <ChildButton
              title={"じぶんのクイズ"}
              startIcon={<Face />}
              link={"/pages/quiz-view"}
              color={"blue"}
            />
          </span>
        </HomeButton>
        <HomeButton
          color={"yellow"}
          title={"ランキング"}
          startIcon={<WorkspacePremium />}
          link="/pages/ranking"
        />
      </div>

      <Link href="/pages/quiz-page">クイズを解く</Link>
      <Button
        component="a"
        href="/pages/quiz-page"
        onClick={() => setDifficulty("hard")}
        variant="contained"
      >
        難しい
      </Button>
      <Button
        component="a"
        href="/pages/quiz-page"
        onClick={() => setDifficulty("easy")}
        variant="contained"
      >
        簡単
      </Button>
      <Button component="a" href="/pages/quiz-view" variant="contained">
        クイズを見る
      </Button>
      <Link href="/pages/quiz-create-page">クイズを作る</Link>
      <Button component="a" href="/pages/ranking" variant="contained">
        ランキング
      </Button>
      <Button
        onClick={() => {
          axios.delete("/api/quiz/delete-all");
        }}
      >
        クイズを全て消す
      </Button>
      <Button
        onClick={() => {
          axios.delete("/api/user/delete-all");
        }}
      >
        ユーザーを全て消す
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          axios.post("/api/quiz/create-dummy");
        }}
      >
        ダミー問題作成
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          axios.post("/api/user/create-dummy");
        }}
      >
        ダミーユーザー作成
      </Button>
    </>
  );
}

// export async function getServerSideProps(context) {
//   const session = await getSession(context);
//   return {
//     props: {
//       session,
//     }
//   }
// }
