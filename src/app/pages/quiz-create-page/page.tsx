"use client";
import {
  Choice,
  ChoicesCreateContainer,
} from "@/app/components/ChoicesCreateContainer/page";
import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [choices, setChoices] = useState<Choice[]>([
    { choiced: false, value: "" },
    { choiced: false, value: "" },
  ]);
  fetch;
  return (
    <>
      <h1>クイズを作る</h1>
      <form action="" method="post">
        <input
          type="text"
          placeholder="タイトル"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input type="checkbox" name="" id="anonymity" />
        <label htmlFor="anonymity">匿名で投稿する</label>
        <input
          type="textarea"
          placeholder="問題文"
          onChange={(e) => setQuestion(e.target.value)}
        />
        <ChoicesCreateContainer choices={choices} updateChoices={setChoices} />
        <input
          type="text"
          placeholder="解説"
          onChange={(e) => setDescription(e.target.value)}
        />
        <input type="submit" value="投稿" />
      </form>
    </>
  );
}
