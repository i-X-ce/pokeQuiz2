import { ReactNode } from "react";
import styles from "./style.module.css";

export default function DescriptionWrapper({
  children,
  className,
  color,
}: {
  children: ReactNode;
  className?: string;
  color?: "red" | "green" | "blue" | "yellow" | "black" | "white" | "gray";
}) {
  const styleColor = `var(--bc-${color || "green"})`;
  return (
    <div className={className + " " + styles.body}>
      <div className={styles.bodyContainer}>
        <p className={styles.title} style={{ color: styleColor }}>
          解説
        </p>
        <div
          className={styles.descriptionWrapper}
          style={{ borderColor: styleColor }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
