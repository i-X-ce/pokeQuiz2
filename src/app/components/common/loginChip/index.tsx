"use client";
import { Edit, Logout, Quiz } from "@mui/icons-material";
import styles from "./style.module.css";
import { Avatar, Button, Fade, Popper } from "@mui/material";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { NickNameInput } from "../NickNameInput";

interface User {
  image: string;
  nickname: string;
  correctCnt: number;
  answerCnt: number;
  createCnt: number;
}

export default function LoginBtn() {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userData, setUserData] = useState<User>();
  const [openNickname, setOpenNickname] = useState(false);

  useEffect(() => {
    axios
      .get("/api/user/get")
      .then((res) => res.data)
      .then((data) => {
        setUserData(data);
      });
  }, [session, openNickname]);

  if (session) {
    return (
      <>
        <div
          className={styles.chip}
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            if (session.status != "authenticated") {
              signIn("google", { prompt: "select_account" });
              return;
            }
            setAnchorEl(e.currentTarget);
            setOpen(!open);
          }}
        >
          <Avatar src={session.data?.user?.image as string} />
          <div className={styles.nickname}>
            {session.status == "authenticated"
              ? userData?.nickname
              : "ログイン"}
          </div>
          <Popper open={open} placement="bottom" anchorEl={anchorEl}>
            <Fade in={open}>
              <div className={styles.popperContent}>
                <Button
                  startIcon={<Edit />}
                  color="blue"
                  onClick={() => {
                    setOpenNickname(!openNickname);
                  }}
                >
                  ニックネーム
                </Button>
                <Button startIcon={<Quiz />} color="blue">
                  作ったクイズ
                </Button>
                <div className={styles.grid4}>
                  <div className={styles.columName}>正答率</div>
                  <div className={styles.columName}>回答数</div>
                  <div className={styles.columValue + " " + styles.blueValue}>
                    {(
                      (100 * userData?.correctCnt) /
                      userData?.answerCnt
                    ).toFixed(1)}
                    %
                  </div>
                  <div className={styles.columValue + " " + styles.blueValue}>
                    {userData?.answerCnt}
                  </div>
                </div>
                <div className={styles.grid4}>
                  <div className={styles.columName}>作成数</div>
                  <div className={styles.columName}>解かれた数</div>
                  <div className={styles.columValue + " " + styles.blueValue}>
                    {userData?.createCnt}
                  </div>
                  <div className={styles.columValue + " " + styles.blueValue}>
                    100
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
            </Fade>
          </Popper>
        </div>

        <NickNameInput
          open={openNickname}
          onClose={() => {
            setOpenNickname(false);
          }}
        />
      </>
    );
  }
}
