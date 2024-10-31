export default function PastQuestionCard(props: any) {
  return (
    <>
      <dt>
        <span>Q.</span>
        <span>{props.index}</span>
        <span>{props.title}</span>
        {props.isCorrect ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M224 96a160 160 0 1 0 0 320 160 160 0 1 0 0-320zM448 256A224 224 0 1 1 0 256a224 224 0 1 1 448 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        )}
      </dt>
      <dd>
        <div>
          <p>あなたの回答</p>
          <div>{props.choices[props.choiceAnswer]}</div>
        </div>
        <div>
          <p>答え</p>
          <div>{props.choices[props.correctAnswer]}</div>
        </div>
        <div>{props.description}</div>
      </dd>
    </>
  );
}
