export default function DescriptionContainer({
  isCorrect,
  answer,
  description,
}: {
  isCorrect: boolean;
  answer: string;
  description: string;
}) {
  return (
    <div>
      <div>{isCorrect ? "正解" : "不正解"}</div>
      <div>
        <div>{answer}</div>
        <div>{description}</div>
      </div>
    </div>
  );
}
