import { Title } from "../../common/Title/page";
import HeadChip from "../HeadChip/page";
import styles from "./style.module.css";

export default function HeadContainer(props: any) {
  fetch;
  return (
    <div className={styles.headContainer}>
      <Title title={props.title} color="red" />
      <span style={{ display: "flex" }}>
        <HeadChip state={props.user} role="投稿者" color="green" />
        <HeadChip state={props.percentage + "%"} role="正答率" color="blue" />
        <HeadChip state={props.score} role="スコア" color="yellow" />
      </span>
    </div>
  );
}
