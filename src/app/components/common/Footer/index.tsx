"use client";
import Link from "next/link";
import { RogoIcon } from "../RogoIcon";
import styles from "./style.module.css";
import { signIn, signOut, useSession } from "next-auth/react";

export function Footer() {
  const session = useSession();

  return (
    <footer className={styles.container}>
      <RogoIcon className={styles.rogo} />
      <ul className={styles.linkContainer}>
        <li
          onClick={() => {
            if (session.status === "authenticated") signOut();
            else signIn("google", { prompt: "select_account" });
          }}
        >
          {session.status === "authenticated" ? "ログアウト" : "ログイン"}
        </li>
        <li>
          <Link className={styles.link} href={"/pages/terms"}>
            利用規約
          </Link>
        </li>
        <li>
          <Link className={styles.link} href={"/pages/privacypolicy"}>
            プライバシーポリシー
          </Link>
        </li>
        <li>
          <Link className={styles.link} href={"/pages/about"}>
            このサイトについて
          </Link>
        </li>
        <li>
          <Link className={styles.link} href={"https://x.com/i_c_e_i_c_e_"}>
            @i_c_e_i_c_e_
          </Link>
        </li>
      </ul>
    </footer>
  );
}
