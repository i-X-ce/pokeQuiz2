"use client";
import { Loading } from "@/app/components/common/Loading/page";
import {
  Choice,
  ChoicesCreateContainer,
} from "@/app/components/create/ChoicesCreateContainer/page";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

interface Question {
  question: string;
  choices: string[];
  correctAnswer: Number;
  description: String;
  title: String;
  userId: string;
  anonymity: boolean;
}

interface User {
  _id: string;
  email: string;
  nickame: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [choices, setChoices] = useState<Choice[]>([
    { choiced: false, value: "" },
    { choiced: false, value: "" },
  ]);
  const [anonymity, setAnonymity] = useState(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    axios
      .get("/api/user/get", {
        params: { email: session?.user?.email, otherParam: "value" },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        console.error("ユーザーデータが取得できません", error);
      });
  }, []);

  // submit時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctAnswer = choices.findIndex((c) => c.choiced === true);
    if (correctAnswer === -1) return;
    const choicesFormat: string[] = choices.map((c) => c.value);
    const newquestion: Question = {
      title,
      question,
      choices: choicesFormat,
      correctAnswer,
      description,
      userId: user?._id || "",
      anonymity,
    };
    axios.put("/api/quiz/update", newquestion);
  };

  if (!user) {
    return <Loading />;
  }

  fetch;
  return (
    <>
      <h1>クイズを作る</h1>
      <form action="" method="post" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="checkbox"
          name=""
          id="anonymity"
          onChange={(e) => setAnonymity(e.target.checked)}
        />
        <label htmlFor="anonymity">匿名で投稿する</label>
        <textarea
          placeholder="問題文"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <ChoicesCreateContainer choices={choices} updateChoices={setChoices} />
        <textarea
          placeholder="解説"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input type="submit" value="投稿" />
      </form>
    </>
  );
}
