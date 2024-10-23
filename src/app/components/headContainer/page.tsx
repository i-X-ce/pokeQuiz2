import styles from "./style.module.css";

export default function HeadContainer(props: any) {
  fetch;
  return (
    <div className={styles.headContainer}>
      <div>{props.title}</div>
      <div>{props.user}</div>
      <div>{props.percentage}</div>
      <div>{props.score}</div>
    </div>
  );
}
