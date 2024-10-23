import HeadChip from "../HeadChip/page";
import styles from "./style.module.css";

export default function HeadContainer(props: any) {
  fetch;
  return (
    <div className={styles.headContainer}>
      <div>{props.title}</div>
      <HeadChip state={props.user} />
      <HeadChip state={props.percentage} />
      <HeadChip state={props.score} />
    </div>
  );
}
