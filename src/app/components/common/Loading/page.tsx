import { Backdrop, CircularProgress, LinearProgress } from "@mui/material";

export function Loading() {
  return (
    <Backdrop open>
      <CircularProgress color="white" />
    </Backdrop>
  );
}
