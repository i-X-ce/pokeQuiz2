"use client";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function LoginBtn() {
  const { data: session, status } = useSession();
  const [fullSession, setFullSession] = useState(session); // セッションの状態を追跡

  useEffect(() => {
    // console.log(status, "update session:", session);
    if (status === "authenticated" && !session?.user?.email) {
      getSession().then((newSession) => {
        setFullSession(newSession); // セッションの更新
      });
    } else {
      setFullSession(session); // sessionが完全な場合はそのままセット
    }
  }, []);

  if (status === "loading") return <div>Loading...</div>;

  if (fullSession) {
    return (
      <>
        Signed in as {fullSession.user?.email || "Loading email..."}
        <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn("google")}>Sign in</button>
    </>
  );
}
