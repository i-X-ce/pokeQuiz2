"use client";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function LoginBtn() {
  const { data: session, status } = useSession();
  // const [fullSession, setFullSession] = useState(session); // セッションの状態を追跡

  useEffect(() => {
    // if (status === "authenticated" && !session?.user?.email) {
    //   getSession().then((newSession) => {
    //     setFullSession(newSession); // セッションの更新
    //   });
    // } else {
    //   setFullSession(session); // sessionが完全な場合はそのままセット
    // }
  }, []);

  if (status === "loading") return <div>Loading...</div>;

  if (session) {
    return (
      <>
        Signed in as {session.user?.email || "Loading email..."}
        <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn("google", { prompt: "select_account" })}>
        Sign in
      </button>
    </>
  );
}
