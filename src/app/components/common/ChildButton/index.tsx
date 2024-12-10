import { ReactNode } from "react";
import styles from "./style.module.css";
import { KeyboardArrowRight } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export function ChildButton({
  title,
  startIcon,
  link,
  color,
  disabled,
}: {
  title: string;
  startIcon: ReactNode;
  link: string;
  color: "red" | "green" | "blue" | "yellow";
  disabled?: boolean;
}) {
  const router = useRouter();

  const titleColor = disabled
    ? styles.disabled
    : color === "red"
    ? styles.red
    : color === "green"
    ? styles.green
    : color === "blue"
    ? styles.blue
    : styles.yellow;

  const handleClick = () => {
    if (disabled) return;
    router.push(link);
  };

  return (
    <div className={styles.button + " " + titleColor} onClick={handleClick}>
      <span className={styles.buttonContent}>
        {startIcon}
        {title}
      </span>
      <KeyboardArrowRight />
    </div>
  );
}
