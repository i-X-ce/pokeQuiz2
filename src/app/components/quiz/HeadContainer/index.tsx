import { Title } from "../../common/Title";
import HeadChip from "../HeadChip";
import styles from "./style.module.css";

export default function HeadContainer({
  title,
  user,
  percentage,
  score,
}: {
  title: string;
  user: string;
  percentage: string;
  score: number;
}) {
  return (
    <div className={styles.headContainer}>
      <Title title={title} color="red" />
      <span className={styles.chips}>
        <HeadChip state={user} role="投稿者" color="green" />
        <HeadChip state={percentage + "%"} role="正答率" color="blue" />
        <HeadChip state={score.toString()} role="スコア" color="yellow" />
      </span>
    </div>
  );
}
