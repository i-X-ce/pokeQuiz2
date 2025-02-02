"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { ChangeEventHandler } from "react";

export function NickNameInput({
  open,
  onClose,
  nickname,
  onChange,
  onEnter,
}: {
  open: boolean;
  onClose: () => void;
  nickname: string;
  onChange:
    | ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  onEnter?: (nickname: string) => void;
}) {
  // const [nickname, setNickname] = useState("");

  const handleNicknameSubmit = async () => {
    if (onEnter) {
      onEnter(nickname);
    }
    await axios.post("/api/user/set", {
      nickname,
    });
  };

  const isError = () => {
    return nickname?.length <= 0 || nickname?.length > 5;
  };

  const helperText = () => {
    return nickname.length <= 0
      ? "ニックネームを入力してください。"
      : nickname.length > 5
      ? "5文字以内で入力してください。"
      : "";
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>ニックネーム変更</DialogTitle>
      <DialogContent>
        <DialogContentText>
          5文字以内のニックネームに変更できます。
        </DialogContentText>
        <TextField
          required
          label={`ニックネーム(${nickname.length}/5)`}
          fullWidth
          variant="standard"
          color="blue"
          value={nickname}
          error={isError()}
          helperText={helperText()}
          onChange={onChange}
        />
        <DialogActions>
          <Button variant="outlined" color="blue" onClick={onClose}>
            キャンセル
          </Button>
          <Button
            variant="contained"
            color="blue"
            onClick={() => {
              if (isError()) return;
              handleNicknameSubmit();
              onClose();
            }}
          >
            決定
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
