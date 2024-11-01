import { Add, Delete } from "@mui/icons-material";
import { Button, IconButton, Radio, TextField } from "@mui/material";
import styles from "./style.module.css";
import { useEffect } from "react";

const MAX_CHOICES_NUM = 8;

export interface Choice {
  choiced: boolean;
  value: string;
  validation: any;
}

export function ChoicesCreateContainer({
  choices,
  updateChoices,
  validation,
}: {
  choices: Choice[];
  updateChoices: (choices: Choice[]) => void;
  validation: any;
}) {
  const addChoice = () => {
    if (choices.length >= MAX_CHOICES_NUM) return;
    updateChoices((prev: any) => [
      ...prev,
      { choiced: false, value: "", validation },
    ]);
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

  const selectAnswer = (key: number) => {
    const newChoices = choices.map((c: Choice, i: number) => ({
      ...c,
      choiced: i === key,
    }));
    updateChoices(newChoices);
  };

  useEffect(() => {
    if (choices.length <= 0) {
      for (var i = 0; i < 1; i++) {
        addChoice();
      }
    }
  }, []);

  return (
    <span className={styles.container}>
      {choices.map((c: Choice, i: number) => (
        <div key={i} className={styles.choice}>
          <Radio
            checked={choices[i].choiced || false}
            onChange={() => selectAnswer(i)}
            color="green"
          />
          <TextField
            required
            fullWidth
            error={c.validation.error(c.value)}
            label={c.validation.label(c.value)}
            helperText={c.validation.helperText(c.value)}
            // label={"選択肢" + (i + 1)}
            placeholder="152"
            value={c.value}
            onChange={(e) => updateChoice(i, e.target.value)}
            color="green"
          />
          <IconButton onClick={() => deleteChoice(i)}>
            <Delete />
          </IconButton>
        </div>
      ))}
      {choices.length < MAX_CHOICES_NUM ? (
        <Button
          variant="contained"
          color="green"
          startIcon={<Add className={styles.add} />}
          onClick={addChoice}
          sx={{ margin: "10px 50px" }}
        />
      ) : null}
    </span>
  );
}
