"use client";
import { Title } from "@/app/components/common/Title/page";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { UserInfo } from "@/app/components/ranking/UserInfo";

interface User {
  nickname: string;
  correctCnt: number;
  answerCnt: number;
  correctRate: number;
  image: string;
}

const userLimitPerPage = 15;

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  const loadingUser = (sortType: string) => {
    axios
      .get("/api/user/get-view", {
        params: { index: 0, size: userLimitPerPage, sortType },
      })
      .then((res) => res.data)
      .then((data) => {
        setUsers(data);
      });
  };

  const handleSelector = (e: SelectChangeEvent) => {
    loadingUser(e.target.value);
  };

  useEffect(() => {
    loadingUser("correct");
  }, []);

  return (
    <>
      <Title color="yellow" title="ランキング" />
      <span className={styles.center}>
        <FormControl>
          <InputLabel color="yellow">ランキング</InputLabel>
          <Select
            defaultValue="correct"
            label="ランキング"
            color="yellow"
            onChange={handleSelector}
          >
            <MenuItem value="correct">正答数ランキング</MenuItem>
            <MenuItem value="answer">回答数ランキング</MenuItem>
            <MenuItem value="create">作成数ランキング</MenuItem>
            <MenuItem value="solved">解かれた数ランキング</MenuItem>
          </Select>
        </FormControl>
      </span>
      <div className={styles.users}>
        <UserInfo dummy />
        {users.map((u, i) => (
          <UserInfo key={i} user={u} rank={i + 1} />
        ))}
      </div>
    </>
  );
}
