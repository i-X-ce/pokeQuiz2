// app/components/SessionWrapper.tsx
"use client"; // クライアントコンポーネントとして宣言

import { SessionProvider } from "next-auth/react";

export default function SessionWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
