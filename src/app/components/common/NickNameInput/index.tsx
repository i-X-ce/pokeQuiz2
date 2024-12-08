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
import { useState } from "react";

export function NickNameInput({
  open,
  onClose,
}: {
  open: boolean;
  onClose: any;
}) {
  const [nickname, setNickname] = useState("");

  const handleNicknameSubmit = async () => {
    await axios.post("/api/user/set", {
      nickname: nickname,
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
          5文字以内のニックネームに変更できます。不適切なニックネームを付けないでね！
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
          onChange={(e) => {
            setNickname(e.target.value);
          }}
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
