"use client";
import { Title } from "@/app/components/common/Title/page";
import axios from "axios";
import { useEffect, useState } from "react";

interface User {
  nickname: string;
  correctCnt: number;
  ansewerCnt: number;
  correctRate: number;
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
      {users.map((u, i) => (
        <div key={i}>
          <div>{u.nickname}</div>
          <div>{u.correctCnt}</div>
          <div>{u.ansewerCnt}</div>
          <div>{(u.correctRate * 100).toFixed(1)}</div>
        </div>
      ))}
    </>
  );
}
