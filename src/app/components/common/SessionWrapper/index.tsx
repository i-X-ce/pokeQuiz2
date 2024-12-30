// app/components/SessionWrapper.tsx
"use client"; // クライアントコンポーネントとして宣言

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export default function SessionWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
