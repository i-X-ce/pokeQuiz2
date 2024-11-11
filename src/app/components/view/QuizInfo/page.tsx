export default function QuizInfo(props: any) {
  const question = props.question;

  return <div>{question.title + question.userName}</div>;
}
