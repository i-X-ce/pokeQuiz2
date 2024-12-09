import { Backdrop, CircularProgress, LinearProgress } from "@mui/material";
import styles from "./style.module.css";

export function Loading() {
  return (
    <div className={styles.backDrop}>
      <CircularProgress color="white" />
    </div>
  );
}
