"use client";

import { extendTheme, ThemeProvider } from "@mui/joy";

const theme = extendTheme({
  fontFamily: {
    display: '"Kiwi Maru"',
    body: '"Kiwi Maru"',
  },
});

export function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
