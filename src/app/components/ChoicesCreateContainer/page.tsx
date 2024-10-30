import { useState } from "react";

export interface Choice {
  choiced: boolean;
  value: string;
}

export function ChoicesCreateContainer({ choices, updateChoices }) {
  const addChoice = () => {
    updateChoices([...choices, { choiced: false, value: "" }]);
  };

  const deleteChoice = (key: number) => {
    if (choices.length <= 2) return;
    let newChoices: Choice[] = choices.filter(
      (_: Choice, i: number) => i !== key
    );
    updateChoices(newChoices);
  };

  const updateChoice = (key: number, s: string) => {
    const newChoices = choices.map((c: Choice, i: number) =>
      i === key ? { ...c, value: s } : c
    );
    updateChoices(newChoices);
  };

  fetch;
  return (
    <div>
      {choices.map((c: Choice, i: number) => (
        <div key={i}>
          <input type="radio" name="choices" />
          <input
            type="text"
            placeholder="選択肢"
            value={c.value}
            onChange={(e) => updateChoice(i, e.target.value)}
          />
          <button type="button" onClick={() => deleteChoice(i)}>
            -
          </button>
        </div>
      ))}
      <button type="button" onClick={addChoice}>
        +
      </button>
    </div>
  );
}
