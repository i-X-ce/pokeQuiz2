import { useSession } from "next-auth/react";
import styles from "./style.module.css";
import LoginBtn from "../LoginChip";
import { Paper, Popper } from "@mui/material";

export function HomeTitle() {
  const session = useSession();

  return (
    <div className={styles.allWrapper}>
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
