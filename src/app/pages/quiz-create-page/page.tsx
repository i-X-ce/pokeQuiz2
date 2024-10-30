"use client";
import {
  Choice,
  ChoicesCreateContainer,
} from "@/app/components/ChoicesCreateContainer/page";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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

  // submit時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctAnswer = choices.findIndex((c) => c.choiced === true);
    if (correctAnswer === -1) return;
    console.log("フォームのデータ", {
      title,
      question,
      choices,
      correctAnswer,
      description,
      anonymity,
    });
    console.log(session);
  };

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
