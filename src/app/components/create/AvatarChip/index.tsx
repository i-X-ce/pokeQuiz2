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
  const size = "var(--font-size-xxxl)";

  if (!session) return null;
  return (
    <div className={styles.container}>
      <div>投稿者</div>
      <div className={styles.avatarInfo}>
        {anonymity ? (
          <Avatar
            sx={{ bgcolor: "var(--bc-green)", width: size, height: size }}
          >
            ?
          </Avatar>
        ) : (
          <Avatar
            src={session.data?.user?.image || ""}
            sx={{ width: size, height: size }}
          />
        )}
        <div className={styles.userName}>
          {anonymity ? "けつばん" : userName}
        </div>
      </div>
    </div>
  );
}
