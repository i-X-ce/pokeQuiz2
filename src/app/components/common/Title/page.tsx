import Link from "next/link";
import styles from "./style.module.css";
import { KeyboardArrowLeft } from "@mui/icons-material";

export function Title(props: any) {
  const color = `background-${props.color}`;
  return (
    <div className={`${styles.wrapper} ${color}`}>
      <Link href="/">
        <KeyboardArrowLeft
          sx={{
            fontSize: "3rem",
            color: "var(--bc-white)",
            marginLeft: "20px",
          }}
        />
      </Link>
      <div className={styles.title}>{props.title}</div>
    </div>
  );
}
