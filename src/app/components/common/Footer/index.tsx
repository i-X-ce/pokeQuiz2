import Link from "next/link";
import { RogoIcon } from "../RogoIcon";
import styles from "./style.module.css";

export function Footer() {
  return (
    <footer className={styles.container}>
      <RogoIcon className={styles.rogo} />
      <ul className={styles.linkContainer}>
        <li>ログアウト</li>
        <li>
          <Link className={styles.link} href={"/pages/terms"}>
            利用規約
          </Link>
        </li>
        <li>このサイトについて</li>
        <li>
          <Link className={styles.link} href={"https://x.com/i_c_e_i_c_e_"}>
            @i_c_e_i_c_e_
          </Link>
        </li>
      </ul>
    </footer>
  );
}
