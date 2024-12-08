import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import styles from "./style.module.css";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose?: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <div className={styles.container}>
        <h2>ログインしましょう！</h2>
        <p>ログインすることでクイズの作成ができるようになります！</p>
        <Button
          variant="outlined"
          color="blue"
          fullWidth
          onClick={() => {
            signIn("google", { prompt: "select_account" });
          }}
          sx={{ textTransform: "none" }}
        >
          Googleでログイン
        </Button>
        <div className={styles.descriptionWrapper}>
          <p className={styles.description}>
            ログインした時点で、当サービスの
            <Link href={"/pages/terms"}>利用規約</Link>・
            <Link href={"/pages/privacypolicy"}>プライバシーポリシー</Link>
            に同意します。
          </p>
          <p className={styles.description}>
            アカウント認証とサービス利用に必要な情報のみ利用し、個人情報などの取得は行いません。
          </p>
        </div>
      </div>
    </Dialog>
  );
}
