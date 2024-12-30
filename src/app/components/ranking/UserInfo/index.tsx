import { Avatar } from "@mui/material";
import styles from "./style.module.css";
import { WorkspacePremium } from "@mui/icons-material";

export function UserInfo({
  user,
  dummy,
  rank,
}: {
  user: {
    image: string;
    nickname: string;
    createCnt?: number;
    correctCnt: number;
    answerCnt: number;
    correctRate: number;
    solvedCnt?: number;
  };
  dummy: boolean;
  rank: number;
}) {
  return (
    <div className={`${styles.user} ${dummy ? styles.dummy : ""}`}>
      <div className={styles.avatarChip}>
        <div className={styles.rank}>
          {rank <= 3 ? (
            <WorkspacePremium
              className={
                rank == 1
                  ? styles.first
                  : rank == 2
                  ? styles.second
                  : styles.third
              }
            />
          ) : (
            rank
          )}
        </div>
        <Avatar src={dummy ? "" : user.image} className={styles.avatar} />
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
      <div className={styles.cell}>
        <p>{dummy ? "解かれた数" : user.solvedCnt || 0}</p>
      </div>
    </div>
  );
}
