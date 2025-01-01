// import styles from "./style.module.css";

import { Backdrop, CircularProgress } from "@mui/material";

export function LoadingLight({ open }: { open: boolean }) {
  return (
    <Backdrop open={open}>
      <CircularProgress color="white"></CircularProgress>
    </Backdrop>
  );
}
