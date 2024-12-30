import styles from "./style.module.css";

export default function HeadChip({
  color,
  state,
  role,
}: {
  color: string;
  state: string;
  role: string;
}) {
  const fc = `font-${color}`;
  const bc = `background-${color}`;

  return (
    <div className={`${styles.headChip} ${bc}`}>
      <div className={`${styles.headChipContent} ${fc}`}>{state}</div>
      <div className={styles.role}>{role}</div>
    </div>
  );
}
