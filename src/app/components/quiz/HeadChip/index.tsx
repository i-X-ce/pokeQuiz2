import styles from "./style.module.css";

export default function HeadChip(props: any) {
  const fc = `font-${props.color}`;
  const bc = `background-${props.color}`;

  fetch;
  return (
    <div className={`${styles.headChip} ${bc}`}>
      <div className={`${styles.headChipContent} ${fc}`}>{props.state}</div>
      <div className={styles.role}>{props.role}</div>
    </div>
  );
}
