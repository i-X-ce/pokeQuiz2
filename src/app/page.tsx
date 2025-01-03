"use client";
import styles from "./style.module.css";
import { HomeButton } from "./components/common/HomeButton";
import {
  AddBox,
  AutoAwesome,
  Face,
  HelpCenter,
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfiedAlt,
  SupervisorAccount,
  ViewModule,
  WorkspacePremium,
} from "@mui/icons-material";
import { ChildButton } from "./components/common/ChildButton";
import { useSession } from "next-auth/react";
import { RogoIcon } from "./components/common/RogoIcon";
import LoginChip from "./components/common/LoginChip";

export default function Home() {
  const session = useSession();

  return (
    <>
      <span className={styles.topTag}>
        <LoginChip />
      </span>
      <div className={styles.topContainer}>
        <RogoIcon className={styles.rogo} text shadow />
        <div className={styles.buttonContainer}>
          <HomeButton
            color={"red"}
            title={"クイズをとく"}
            startIcon={
              <HelpCenter sx={{ fontSize: "var(--font-size-xxxl)" }} />
            }
            childrenTitle="難易度"
          >
            <span className={styles.childButtonContainer}>
              <ChildButton
                title={"あたらしい"}
                startIcon={<AutoAwesome />}
                link={"/pages/quiz-page?difficulty=newest"}
                color={"red"}
              />
              <ChildButton
                title={"むずかしい"}
                startIcon={<SentimentDissatisfied />}
                link={"/pages/quiz-page?difficulty=hard"}
                color={"red"}
              />
              <ChildButton
                title={"ふつう"}
                startIcon={<SentimentNeutral />}
                link={"/pages/quiz-page?difficulty=normal"}
                color={"red"}
              />
              <ChildButton
                title={"かんたん"}
                startIcon={<SentimentSatisfiedAlt />}
                link={"/pages/quiz-page?difficulty=easy"}
                color={"red"}
              />
            </span>
          </HomeButton>
          <HomeButton
            color={"green"}
            title={"クイズをつくる"}
            startIcon={<AddBox sx={{ fontSize: "var(--font-size-xxxl)" }} />}
            link="/pages/quiz-create-page?id=new"
            disabled={session.status !== "authenticated"}
          />

          <HomeButton
            color={"blue"}
            title={"クイズをみる"}
            startIcon={
              <ViewModule sx={{ fontSize: "var(--font-size-xxxl)" }} />
            }
            childrenTitle="どっちをみる？"
          >
            <span className={styles.childButtonContainer}>
              <ChildButton
                title={"みんなのクイズ"}
                startIcon={<SupervisorAccount />}
                link={"/pages/quiz-view?range=all"}
                color={"blue"}
              />
              <ChildButton
                title={"じぶんのクイズ"}
                startIcon={<Face />}
                link={"/pages/quiz-view?range=mine"}
                color={"blue"}
                disabled={session.status !== "authenticated"}
              />
            </span>
          </HomeButton>
          <HomeButton
            color={"yellow"}
            title={"ランキング"}
            startIcon={
              <WorkspacePremium sx={{ fontSize: "var(--font-size-xxxl)" }} />
            }
            link="/pages/ranking"
          />
        </div>
      </div>

      {/* <Button
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
      </Button> */}
    </>
  );
}
