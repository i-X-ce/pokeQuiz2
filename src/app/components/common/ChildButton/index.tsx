import { ReactNode } from "react";
import styles from "./style.module.css";
import Link from "next/link";
import { KeyboardArrowRight } from "@mui/icons-material";

export function ChildButton({
  title,
  startIcon,
  link,
  color,
}: {
  title: string;
  startIcon: ReactNode;
  link: string;
  color: "red" | "green" | "blue" | "yellow";
}) {
  const titleColor =
    color === "red"
      ? styles.red
      : color === "green"
      ? styles.green
      : color === "blue"
      ? styles.blue
      : styles.yellow;

  return (
    <Link className={styles.button + " " + titleColor} href={link}>
      <span>
        {startIcon}
        {title}
      </span>
      <KeyboardArrowRight />
    </Link>
  );
}
