import type { Metadata } from "next";
import "./globals.css";
import { getServerSession, Session } from "next-auth";
import SessionWrapper from "./components/common/SessionWrapper";
import { Kiwi_Maru } from "next/font/google";
import { ThemeProviderWrapper } from "./components/common/ThemeProviderWrapper";
import { Footer } from "./components/common/Footer";
import { AnimationBG } from "./components/common/AnimationBG";
import { authOptions } from "./lib/auth";

export const metadata: Metadata = {
  title: "BugPokeQuiz",
  description:
    "ポケモンのバグに関するクイズが集まっているよ！最高のバグクイズをあなたにお届け！",
};

const kiwiMaru = Kiwi_Maru({
  subsets: ["latin"],
  weight: "300",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <SessionWrapper session={session as Session}>
      <ThemeProviderWrapper>
        <html lang="ja">
          <body className={kiwiMaru.className}>
            {children}
            <Footer />
            <AnimationBG />
          </body>
        </html>
      </ThemeProviderWrapper>
    </SessionWrapper>
  );
}
