import Link from "next/link";
import styles from "./style.module.css";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { RogoIcon } from "../RogoIcon";

export function Title({
  title,
  color,
}: {
  title: string;
  color: "red" | "green" | "blue" | "yellow" | "gray" | "white" | "black";
}) {
  const styleColor = `background-${color}`;
  return (
    <div className={`${styles.wrapper} ${styleColor}`}>
      {/* <Link href="/">
        <KeyboardArrowLeft
          sx={{
            fontSize: "3rem",
            color: "var(--bc-white)",
            marginLeft: "20px",
          }}
        />
      </Link> */}
      <RogoIcon className={styles.rogo} />
      <div className={styles.title}>{title}</div>
    </div>
  );
}
