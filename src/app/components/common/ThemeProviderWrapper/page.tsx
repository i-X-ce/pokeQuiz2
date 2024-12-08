"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";

// const theme = extendTheme({
//   // フォント
//   fontFamily: {
//     display: '"Kiwi Maru"',
//     body: '"Kiwi Maru"',
//   },
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
// });

export function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState(createTheme({}));

  useEffect(() => {
    const applyTheme = () => {
      const rootStyle = getComputedStyle(document.documentElement);
      const whiteMain = rootStyle.getPropertyValue("--bc-white").trim();
      const grayMain = rootStyle.getPropertyValue("--bc-gray").trim();
      const blackMain = rootStyle.getPropertyValue("--bc-black").trim();
      const redMain = rootStyle.getPropertyValue("--bc-red").trim();
      const greenMain = rootStyle.getPropertyValue("--bc-green").trim();
      const blueMain = rootStyle.getPropertyValue("--bc-blue").trim();
      const yellowMain = rootStyle.getPropertyValue("--bc-yellow").trim();

      setTheme(
        createTheme({
          typography: {
            fontFamily: ['"Kiwi Maru"'].join(","),
          },
          palette: {
            white: theme.palette.augmentColor({
              color: { main: whiteMain, contrastText: blackMain },
            }),
            gray: theme.palette.augmentColor({
              color: { main: grayMain, contrastText: whiteMain },
            }),
            black: theme.palette.augmentColor({
              color: { main: blackMain, contrastText: whiteMain },
            }),
            red: theme.palette.augmentColor({
              color: { main: redMain, contrastText: whiteMain },
            }),
            green: theme.palette.augmentColor({
              color: { main: greenMain, contrastText: whiteMain },
            }),
            blue: theme.palette.augmentColor({
              color: { main: blueMain, contrastText: whiteMain },
            }),
            yellow: theme.palette.augmentColor({
              color: { main: yellowMain, contrastText: whiteMain },
            }),
          },
        })
      );
    };

    if (document.fonts) {
      document.fonts.ready.then(applyTheme); // フォントが読み込まれてから適用
    } else {
      window.addEventListener("load", applyTheme); // フォントAPIがない場合、loadイベントを待つ
    }

    return () => window.removeEventListener("load", applyTheme);
  }, []);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
