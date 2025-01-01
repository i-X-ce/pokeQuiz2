"use client";

import { createTheme, PaletteColor, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";

declare module "@mui/material/styles" {
  interface Theme {
    palette: {
      white: PaletteColor;
      gray: PaletteColor;
      black: PaletteColor;
      red: PaletteColor;
      green: PaletteColor;
      blue: PaletteColor;
      yellow: PaletteColor;
    };
  }

  interface PaletteOptions {
    white?: PaletteColor;
    gray?: PaletteColor;
    black?: PaletteColor;
    red?: PaletteColor;
    green?: PaletteColor;
    blue?: PaletteColor;
    yellow?: PaletteColor;
  }

  interface ThemeOptions {
    palette?: PaletteOptions;
  }
}

declare module "@mui/material/CircularProgress" {
  interface CircularProgressPropsColorOverrides {
    white?: true;
    gray?: true;
    black?: true;
    red?: true;
    green?: true;
    blue?: true;
    yellow?: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    white?: true;
    gray?: true;
    black?: true;
    red?: true;
    green?: true;
    blue?: true;
    yellow?: true;
  }
}

declare module "@mui/material/TextField" {
  interface TextFieldPropsColorOverrides {
    white?: true;
    gray?: true;
    black?: true;
    red?: true;
    green?: true;
    blue?: true;
    yellow?: true;
  }
}

declare module "@mui/material/Pagination" {
  interface PaginationPropsColorOverrides {
    white?: true;
    gray?: true;
    black?: true;
    red?: true;
    green?: true;
    blue?: true;
    yellow?: true;
  }
}

declare module "@mui/material/IconButton" {
  interface IconButtonPropsColorOverrides {
    white?: true;
    gray?: true;
    black?: true;
    red?: true;
    green?: true;
    blue?: true;
    yellow?: true;
  }
}

declare module "@mui/material/Radio" {
  interface RadioPropsColorOverrides {
    white?: true;
    gray?: true;
    black?: true;
    red?: true;
    green?: true;
    blue?: true;
    yellow?: true;
  }
}

declare module "@mui/material/SvgIcon" {
  interface SvgIconPropsColorOverrides {
    white?: true;
    gray?: true;
    black?: true;
    red?: true;
    green?: true;
    blue?: true;
    yellow?: true;
  }
}

declare module "@mui/material/Switch" {
  interface SwitchPropsColorOverrides {
    white?: true;
    gray?: true;
    black?: true;
    red?: true;
    green?: true;
    blue?: true;
    yellow?: true;
  }
}

declare module "@mui/material/ToggleButtonGroup" {
  interface ToggleButtonGroupPropsColorOverrides {
    white?: true;
    gray?: true;
    black?: true;
    red?: true;
    green?: true;
    blue?: true;
    yellow?: true;
  }
}

declare module "@mui/material/InputLabel" {
  interface InputLabelPropsColorOverrides {
    white?: true;
    gray?: true;
    black?: true;
    red?: true;
    green?: true;
    blue?: true;
    yellow?: true;
  }
}

declare module "@mui/material/Select" {
  interface InputBasePropsColorOverrides {
    white?: true;
    gray?: true;
    black?: true;
    red?: true;
    green?: true;
    blue?: true;
    yellow?: true;
  }
}

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
            white: {
              main: whiteMain,
              contrastText: blackMain,
              light: whiteMain,
              dark: whiteMain,
            },
            gray: {
              main: grayMain,
              contrastText: blackMain,
              light: grayMain,
              dark: grayMain,
            },
            black: {
              main: blackMain,
              contrastText: whiteMain,
              light: blackMain,
              dark: blackMain,
            },
            red: {
              main: redMain,
              contrastText: whiteMain,
              light: redMain,
              dark: redMain,
            },
            green: {
              main: greenMain,
              contrastText: whiteMain,
              light: greenMain,
              dark: greenMain,
            },
            blue: {
              main: blueMain,
              contrastText: whiteMain,
              light: blueMain,
              dark: blueMain,
            },
            yellow: {
              main: yellowMain,
              contrastText: blackMain,
              light: yellowMain,
              dark: yellowMain,
            },
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
