import { useSession } from "next-auth/react";
import styles from "./style.module.css";
import LoginBtn from "../loginBtn/page";

export function HomeTitle() {
  const session = useSession();

  return (
    <div>
      <div className={styles.topWrapper}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>バグポケクイズ</div>
        </div>
        <div className={styles.loginWrapper}>
          <LoginBtn />
        </div>
      </div>
      <div className={styles.bottomWrapper}>
        <div className={styles.greenDecoration}></div>
        <div className={styles.blueDecoration}></div>
      </div>
    </div>
  );
}
