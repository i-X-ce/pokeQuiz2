import styles from "./style.module.css";

export function Title(props: any) {
  const color = `background-${props.color}`;
  return (
    <div className={`${styles.wrapper} ${color}`}>
      <div className={styles.title}>{props.title}</div>
    </div>
  );
}
