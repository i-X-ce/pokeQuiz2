import { Add, Delete } from "@mui/icons-material";
import { Button, IconButton, Radio, TextField, Tooltip } from "@mui/material";
import styles from "./style.module.css";

const MAX_CHOICES_NUM = 8;

const PLACEHOLDERS: string[] = [
  "サファリボールの個数",
  "手持ちポケモンの数",
  "ボックスポケモンの数",
  "どうぐ",
  "ボックスポケモンのニックネーム",
  "手持ちポケモンのニックネーム",
  "そだてやのフラグ",
  "エンカウントテーブル",
];

export interface Choice {
  choiced: boolean;
  value: string;
}

export function ChoicesCreateContainer({
  choices,
  updateChoices,
  validation,
}: {
  choices: Choice[];
  updateChoices: (choices: Choice[]) => void;
  validation: {
    error: (value: string) => boolean;
    label: (value: string) => string;
    helperText: (value: string) => string;
  };
}) {
  const addChoice = () => {
    if (choices.length >= MAX_CHOICES_NUM) return;
    const newChoices = [...choices, { choiced: false, value: "" }];
    updateChoices(newChoices);
  };

  const deleteChoice = (key: number) => {
    if (choices.length <= 2) return;
    const newChoices: Choice[] = choices.filter(
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

  // useEffect(() => {}, []);

  // if (choices.length <= 0) {
  //   for (var i = 0; i < 2; i++) {
  //     addChoice();
  //   }
  // }

  return (
    <span className={styles.container}>
      {choices.map((c: Choice, i: number) => (
        <div key={i} className={styles.choice}>
          {/* <Radio
            className={styles.ratio}
            checked={choices[i].choiced || false}
            onChange={() => selectAnswer(i)}
            color="green"
          /> */}
          <TextField
            required
            fullWidth
            error={validation.error(c.value)}
            label={validation.label(c.value)}
            helperText={validation.helperText(c.value)}
            // label={"選択肢" + (i + 1)}
            placeholder={`例）${PLACEHOLDERS[i]}`}
            value={c.value}
            onChange={(e) => updateChoice(i, e.target.value)}
            color="green"
            slotProps={{
              input: {
                startAdornment: (
                  <Tooltip title="正解にする" arrow>
                    <Radio
                      // className={styles.ratio}
                      checked={choices[i].choiced || false}
                      onChange={() => selectAnswer(i)}
                      color="green"
                    />
                  </Tooltip>
                ),
                endAdornment: (
                  <Tooltip title="削除" arrow>
                    <IconButton
                      // className={styles.ratio + " " + styles.trash}
                      onClick={() => deleteChoice(i)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                ),
              },
            }}
          />
        </div>
      ))}
      {choices.length < MAX_CHOICES_NUM ? (
        <Tooltip title="選択肢を追加" arrow>
          <Button
            variant="contained"
            color="green"
            startIcon={<Add className={styles.add} />}
            onClick={addChoice}
            sx={{ margin: "var(--space-sm)" }}
          />
        </Tooltip>
      ) : null}
    </span>
  );
}
