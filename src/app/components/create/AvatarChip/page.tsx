import { Avatar, Divider } from "@mui/material";
import { useSession } from "next-auth/react";
import styles from "./style.module.css";

export function AvatarChip({
  anonymity,
  userName,
}: {
  anonymity: boolean;
  userName: string;
}) {
  const session = useSession();

  if (!session) return null;
  console.log(userName);
  return (
    <div className={styles.container}>
      <div>投稿者</div>
      <div className={styles.avatarInfo}>
        {anonymity ? (
          <Avatar sx={{ bgcolor: "var(--bc-green)" }}>?</Avatar>
        ) : (
          <Avatar src={session.data?.user?.image || ""} />
        )}
        <div className={styles.userName}>
          {anonymity ? "けつばん" : userName}
        </div>
      </div>
    </div>
  );
}
