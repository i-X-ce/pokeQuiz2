"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function NickNameInput() {
  const { data: session } = useSession();
  const [nickname, setNickname] = useState("");

  const handleNicknameSubmit = async () => {
    await axios.post("/api/user/set", {
      email: session?.user?.email,
      nickname: nickname,
    });
  };

  return (
    <div>
      <h2>ニックネームを入力してください</h2>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <button onClick={handleNicknameSubmit}>保存</button>
    </div>
  );
}
