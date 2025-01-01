"use client";
import { Edit, Logout, Quiz } from "@mui/icons-material";
import styles from "./style.module.css";
import { Avatar, Divider, IconButton, Popover, Tooltip } from "@mui/material";
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
            <div className={styles.buttonContainer}>
              <Tooltip title="ニックネーム" arrow>
                <IconButton
                  onClick={() => {
                    setOpenNickname(!openNickname);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="作ったクイズ" arrow>
                <IconButton component="a" href="/pages/quiz-view?range=mine">
                  <Quiz />
                </IconButton>
              </Tooltip>
              <Tooltip title="ログアウト" arrow>
                <IconButton color="red" onClick={() => signOut()}>
                  <Logout />
                </IconButton>
              </Tooltip>
            </div>
            <Divider />
            <div className={styles.grid4}>
              <ValueCell
                title="正答率"
                value={
                  (userData?.createCnt &&
                    (
                      (100 * (userData?.correctCnt || 0)) /
                      (userData?.answerCnt || 1)
                    ).toFixed(1) + "%") ||
                  "?"
                }
                color="red"
              />
              <ValueCell
                title="正解数"
                value={userData?.correctCnt || "?"}
                color="green"
              />
              <ValueCell
                title="作成数"
                value={userData?.createCnt || "?"}
                color="blue"
              />
              <ValueCell
                title="解かれた数"
                value={userData?.solvedCnt || "?"}
                color="yellow"
              />
            </div>
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

function ValueCell({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: "red" | "green" | "blue" | "yellow";
}) {
  return (
    <div className={styles.valueCell}>
      <div className={styles.valueCellTitle}>{title}</div>
      <div
        style={{ color: `var(--bc-${color})` }}
        className={styles.valueCellValue}
      >
        {value}
      </div>
    </div>
  );
}
