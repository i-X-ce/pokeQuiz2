import PastQuestionCard from "../PastQuestionCard/page";

export default function PastQuestionContainer(props: any) {
  const questions: any = props.questions;
  return (
    <dl>
      {questions.map((q: any, i: number) => {
        return <PastQuestionCard {...q} index={i + 1} key={i} />;
      })}
    </dl>
  );
}
