import {
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import { ReactNode, useState } from "react";
import styles from "./style.module.css";
import { ArrowDropDownCircle, KeyboardArrowRight } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export function HomeButton({
  color,
  title,
  children,
  startIcon,
  link,
  disabled,
  childrenTitle,
}: {
  color: "red" | "green" | "blue" | "yellow";
  title: string;
  children?: ReactNode;
  startIcon?: ReactNode;
  link?: string;
  disabled?: boolean;
  childrenTitle?: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // const titleColor = disabled
  //   ? styles.disabled
  //   : color === "red"
  //   ? styles.red
  //   : color === "green"
  //   ? styles.green
  //   : color === "blue"
  //   ? styles.blue
  //   : styles.yellow;

  const handleClick = () => {
    if (disabled) return;
    if (link !== undefined) {
      router.push(link);
      return;
    }
    setOpen((prev) => !prev);
  };

  const styleColor = `var(--bc-${color})`;

  return (
    <div className={styles.parentContainer} onClick={handleClick}>
      <div
        className={styles.container + (disabled ? " " + styles.disabled : "")}
        style={{ backgroundColor: styleColor }}
      >
        {startIcon}
        {title}
        {/* <div
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
      <Collapse in={open}>{children}</Collapse> */}
      </div>

      <Dialog open={open} maxWidth={false}>
        <DialogTitle>{childrenTitle}</DialogTitle>
        <Divider />
        <div className={styles.dialogContainer}>{children}</div>
      </Dialog>
    </div>
  );
}
