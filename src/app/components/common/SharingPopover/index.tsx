import shareOnTwitter from "@/app/lib/shareOnTwitter";
import styles from "./style.module.css";

import { InsertLink, Share, Twitter } from "@mui/icons-material";
import { IconButton, Popover, Tooltip } from "@mui/material";
import { useState } from "react";

export function SharingPopover({ text, url }: { text: string; url: string }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <div>
      <Tooltip title="共有">
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Share />
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <div className={styles.buttonContainer}>
          <Tooltip title="リンクをコピー" arrow placement="top">
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(url);
              }}
            >
              <InsertLink />
            </IconButton>
          </Tooltip>

          <Tooltip title="Twitterで共有" arrow placement="top">
            <IconButton
              onClick={() => {
                shareOnTwitter(text, url);
              }}
            >
              <Twitter />
            </IconButton>
          </Tooltip>

          <Tooltip title="Mikeyで共有" arrow placement="top">
            <IconButton
              onClick={() => {
                const mikeyUrl = `https://misskeyshare.link/share.html?text=${encodeURI(
                  text
                )}&url=${encodeURI(url)}`;
                window.open(mikeyUrl, "_blank");
              }}
            >
              <img
                src="/img/mi.webp"
                className={`${styles.iconImg} ${styles.miskeyIcon}`}
              />
            </IconButton>
          </Tooltip>

          <Tooltip title="uwuzuで共有" arrow placement="top">
            <IconButton
              onClick={() => {
                const uwuzuUrl = `https://share.uwuzu.net/?text=${encodeURI(
                  text + "\n" + url
                )}`;
                window.open(uwuzuUrl, "_blank");
              }}
              sx={{
                aspectRatio: 1,
              }}
            >
              <p className={`${styles.iconImg} ${styles.uwuzuIcon}`}>uw</p>
            </IconButton>
          </Tooltip>
        </div>
      </Popover>
    </div>
  );
}
