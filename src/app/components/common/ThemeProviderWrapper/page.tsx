"use client";

import { extendTheme, ThemeProvider } from "@mui/joy";

const theme = extendTheme({
  // フォント
  fontFamily: {
    display: '"Kiwi Maru"',
    body: '"Kiwi Maru"',
  },
  // 色
  //   colorSchemes: {
  //     light: {
  //       palette: {
  //         primary: {
  //           mainChannel: "var(--bc-blue)",
  //         },
  //         success: {
  //           mainChannel: "var(--bc-green)",
  //         },
  //         danger: {
  //           mainChannel: "var(--bc-red)",
  //         },
  //         warning: {
  //           mainChannel: "var(--bc-yellow)",
  //         },
  //       },
  //     },
  //   },
});

export function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
