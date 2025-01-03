import { Avatar, Tooltip } from "@mui/material";
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
  rank?: number;
}) {
  return (
    <div className={`${styles.user} ${user ? "" : styles.dummy}`}>
      <div className={styles.avatarChip}>
        <div className={styles.rank}>
          {rank && rank <= 3 ? (
            <WorkspacePremium
              className={
                rank == 1
                  ? styles.first
                  : rank == 2
                  ? styles.second
                  : styles.third
              }
            />
          ) : rank ? (
            <p className={styles.rankNumber}>{rank}</p>
          ) : (
            ""
          )}
        </div>
        <Avatar src={user?.image} className={styles.avatar} />
        <div className={styles.nickname}>
          {user?.nickname || "ニックネーム"}
        </div>
      </div>
      <Tooltip title="問題作成数">
        <div className={styles.cell}>
          <p>{user ? user.createCnt || 0 : "問題作成数"}</p>
        </div>
      </Tooltip>
      <Tooltip title="正解数">
        <div className={styles.cell}>
          <p>{user ? user?.correctCnt || 0 : "正解数"}</p>
        </div>
      </Tooltip>
      <Tooltip title="回答数">
        <div className={styles.cell}>
          <p>{user ? user?.answerCnt || 0 : "回答数"}</p>
        </div>
      </Tooltip>
      <Tooltip title="正答率">
        <div className={styles.cell}>
          <p>
            {user
              ? ((user?.correctRate || 0) * 100).toFixed(1) + "%"
              : "正答率"}
          </p>
        </div>
      </Tooltip>
      <Tooltip title="回解かれた数">
        <div className={styles.cell}>
          <p>{user ? user?.solvedCnt || 0 : "解かれた数"}</p>
        </div>
      </Tooltip>
    </div>
  );
}
