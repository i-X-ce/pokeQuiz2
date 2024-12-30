import styles from "./style.module.css";
import LoginChip from "../LoginChip";
import { RogoIcon } from "../RogoIcon";

export function HomeTitle() {
  return (
    <div className={styles.allWrapper}>
      <div className={styles.topWrapper}>
        <div className={styles.titleWrapper}>
          {/* <div className={styles.title}>バグポケクイズ</div> */}
          <RogoIcon text className={styles.title} />
        </div>
        <div className={styles.loginWrapper}>
          <LoginChip />
        </div>
      </div>
      <div className={styles.bottomWrapper}>
        <div className={styles.greenDecoration}></div>
        <div className={styles.blueDecoration}></div>
      </div>
    </div>
  );
}
