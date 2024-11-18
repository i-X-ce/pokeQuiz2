"use client";
import { Title } from "@/app/components/common/Title/page";
import { Avatar } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { UserInfo } from "@/app/components/ranking/UserCell";

interface User {
  nickname: string;
  correctCnt: number;
  answerCnt: number;
  correctRate: number;
  image: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios
      .get("/api/user/get-view", {
        params: { index: 0, size: 10, sortType: "test" },
      })
      .then((res) => res.data)
      .then((data) => {
        setUsers(data);
      });
  }, []);

  return (
    <>
      <Title color="yellow" title="ランキング" />
      <div className={styles.users}>
        <UserInfo dummy />
        {users.map((u, i) => (
          <UserInfo key={i} user={u} />
        ))}
      </div>
    </>
  );
}
