"use client";
import { Edit, Logout, Quiz } from "@mui/icons-material";
import styles from "./style.module.css";
import { Avatar, Button, Popover } from "@mui/material";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { NickNameInput } from "../NickNameInput";
import LoginDialog from "../LoginDialog";

interface User {
  image: string;
  nickname: string;
  correctCnt: number;
  answerCnt: number;
  createCnt: number;
  solvedCnt: number;
}

export default function LoginChip() {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userData, setUserData] = useState<User>();
  const [openNickname, setOpenNickname] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [nickname, setNickname] = useState("");
  const [nicknameTmp, setNicknameTmp] = useState("");

  useEffect(() => {
    axios
      .get("/api/user/get")
      .then((res) => res.data)
      .then((data) => {
        setUserData(data);
        setNickname(data.nickname);
        setNicknameTmp(data.nickname);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <div
        className={styles.chip}
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          if (session.status != "authenticated") {
            // signIn("google", { prompt: "select_account" });
            setOpenLoginDialog(true);
            return;
          }
          setAnchorEl(e.currentTarget);
          setOpen(!open);
        }}
      >
        <Avatar src={session.data?.user?.image as string} />
        <div
          className={styles.nickname}
          style={{
            color:
              session.status == "authenticated"
                ? "var(--bc-black)"
                : "var(--bc-gray)",
          }}
        >
          {session.status == "authenticated"
            ? nickname.slice(0, 5) || "-----"
            : "ログイン"}
        </div>
        <Popover
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <div className={styles.popperContent}>
            <Button
              startIcon={<Edit />}
              color="gray"
              onClick={() => {
                setOpenNickname(!openNickname);
              }}
            >
              ニックネーム
            </Button>
            <Button
              startIcon={<Quiz />}
              color="gray"
              component="a"
              href="/pages/quiz-view?range=mine"
            >
              作ったクイズ
            </Button>
            <div className={styles.grid4}>
              <div className={styles.columName}>正答率</div>
              <div className={styles.columName}>回答数</div>
              <div className={styles.columValue + " " + styles.redValue}>
                {(
                  (100 * (userData?.correctCnt || 0)) /
                  (userData?.answerCnt || 1)
                ).toFixed(1)}
                %
              </div>
              <div className={styles.columValue + " " + styles.greenValue}>
                {userData?.answerCnt}
              </div>
            </div>
            <div className={styles.grid4}>
              <div className={styles.columName}>作成数</div>
              <div className={styles.columName}>解かれた数</div>
              <div className={styles.columValue + " " + styles.blueValue}>
                {userData?.createCnt}
              </div>
              <div className={styles.columValue + " " + styles.yellowValue}>
                {userData?.solvedCnt}
              </div>
            </div>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => signOut()}
              color="red"
              startIcon={<Logout />}
            >
              ログアウト
            </Button>
          </div>
        </Popover>
      </div>

      <NickNameInput
        open={openNickname}
        onClose={() => {
          setOpenNickname(false);
        }}
        nickname={nicknameTmp}
        onChange={(e) => {
          setNicknameTmp(e.target.value);
        }}
        onEnter={setNickname}
      />

      <LoginDialog
        open={openLoginDialog}
        onClose={() => {
          setOpenLoginDialog(false);
        }}
      />
    </>
  );
}
