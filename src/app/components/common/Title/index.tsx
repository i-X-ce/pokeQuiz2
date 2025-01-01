import styles from "./style.module.css";
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
      <RogoIcon className={styles.rogo} />
      <div className={styles.title}>{title}</div>
    </div>
  );
}
