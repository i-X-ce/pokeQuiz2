import { Avatar } from "@mui/material";
import styles from "./style.module.css";

export function UserInfo(props: any) {
  const user = props.user;
  const dummy = props.dummy;

  return (
    <div className={`${styles.user} ${dummy ? styles.dummy : ""}`}>
      <div className={styles.avatarChip}>
        <Avatar
          src={dummy ? "" : user.image}
          className={styles.avatar}
          sx={{ margin: "0 10px", backgroundColor: "var(--bc-yellow)" }}
        />
        <div className={styles.nickname}>
          {dummy ? "ニックネーム" : user.nickname}
        </div>
      </div>
      <div className={styles.cell}>
        <p>{dummy ? "問題作成数" : user.createCnt || 0}</p>
      </div>
      <div className={styles.cell}>
        <p>{dummy ? "正答数" : user.correctCnt}</p>
      </div>
      <div className={styles.cell}>
        <p>{dummy ? "回答数" : user.answerCnt}</p>
      </div>
      <div className={styles.cell}>
        <p>{dummy ? "正答率" : (user.correctRate * 100).toFixed(1) + "%"}</p>
      </div>
    </div>
  );
}
