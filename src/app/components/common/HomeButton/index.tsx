import { Collapse } from "@mui/material";
import { ReactNode, useState } from "react";
import styles from "./style.module.css";
import { ArrowDropDownCircle, KeyboardArrowRight } from "@mui/icons-material";
import { useRouter } from "next/navigation";

type Props = {
  color: "red" | "green" | "blue" | "yellow";
  title: string;
  children?: ReactNode;
  startIcon?: ReactNode;
  link?: string;
  disabled?: boolean;
};

export function HomeButton({
  color,
  title,
  children,
  startIcon,
  link,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
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
    if (link !== undefined) {
      router.push(link);
      return;
    }
    setOpen((prev) => !prev);
  };

  return (
    <>
      <div
        className={styles.titleButton + " " + titleColor}
        onClick={handleClick}
      >
        <span className={styles.buttonContent}>
          <span>
            {startIcon}
            {title}
          </span>
          {link ? (
            <KeyboardArrowRight />
          ) : (
            <ArrowDropDownCircle
              className={open ? styles.onIcon : styles.offIcon}
            />
          )}
        </span>
      </div>
      <Collapse in={open}>{children}</Collapse>
    </>
  );
}
