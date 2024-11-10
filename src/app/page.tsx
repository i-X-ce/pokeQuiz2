"use client";

import Link from "next/link";
import LoginBtn from "./components/common/loginBtn/page";
import { NickNameInput } from "./components/common/NickNameInput/page";
import { Button } from "@mui/material";
import axios from "axios";

export default function Home() {
  fetch;
  return (
    <>
      <Link href="/pages/quiz-page">クイズを解く</Link>
      <Link href="/pages/quiz-create-page">クイズを作る</Link>
      <Button
        onClick={() => {
          axios.delete("/api/quiz/delete-all");
        }}
      >
        クイズを全て消す
      </Button>
      <Button
        onClick={() => {
          axios.post("/api/quiz/create-dummy");
        }}
      >
        ダミー問題を作成する
      </Button>
      <LoginBtn />
      <NickNameInput />
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
