import { Avatar } from "@mui/material";
import styles from "./style.module.css";
import { WorkspacePremium } from "@mui/icons-material";

export function UserInfo({
  user,
  rank,
}: {
  user?: {
    image?: string;
    nickname?: string;
    createCnt?: number;
    correctCnt?: number;
    answerCnt?: number;
    correctRate?: number;
    solvedCnt?: number;
  };
  rank: number;
}) {
  return (
    <div className={`${styles.user} ${user ? "" : styles.dummy}`}>
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
        <Avatar src={user?.image} className={styles.avatar} />
        <div className={styles.nickname}>
          {user?.nickname || "ニックネーム"}
        </div>
      </div>
      <div className={styles.cell}>
        <p>{user ? user.createCnt || 0 : "問題作成数"}</p>
      </div>
      <div className={styles.cell}>
        <p>{user?.correctCnt || "正解数"}</p>
      </div>
      <div className={styles.cell}>
        <p>{user?.answerCnt || "回答数"}</p>
      </div>
      <div className={styles.cell}>
        <p>
          {user ? ((user?.correctRate || 0) * 100).toFixed(1) + "%" : "正答率"}
        </p>
      </div>
      <div className={styles.cell}>
        <p>{user ? user?.solvedCnt || 0 : "解かれた数"}</p>
      </div>
    </div>
  );
}
