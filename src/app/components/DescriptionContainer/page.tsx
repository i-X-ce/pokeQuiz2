export default function DescriptionContainer(props: any) {
  fetch;
  return (
    <div>
      <div>{props.isCorrect ? "正解" : "不正解"}</div>
      <div>
        <div>{props.answer}</div>
        <div>{props.description}</div>
      </div>
    </div>
  );
}
