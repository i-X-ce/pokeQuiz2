import PastQuestionCard from "../PastQuestionCard/page";

export default function PastQuestionContainer(props: any) {
  const questions: any = props.questions;
  console.log(questions);
  return (
    <dl>
      {questions.map((q: any, i: number) => {
        console.log(q.choiceAnswer);
        return <PastQuestionCard {...q} index={i} key={i} />;
      })}
    </dl>
  );
}
