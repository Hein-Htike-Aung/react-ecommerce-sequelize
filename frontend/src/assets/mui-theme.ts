import { createTheme } from "@mui/material";

const Colors = {
  primary: "#7272d2",
  layout: "#1c292f",
  secondary: "#1d5e7c",
  success: "#75b575",
  lightblue: "#096fa2",
  info: "#00a2ff",
  warn: "#fc0000ba",
  white: "#fff",
  black: "#000",
};

const Mui_Theme = (themeMode: boolean) => {
  const theme = createTheme({
    palette: {
      mode: themeMode ? "dark" : "light",
      primary: {
        main: Colors.primary,
      },
      secondary: {
        main: Colors.secondary,
      },
    },
  });

  return theme;
};

export default Mui_Theme;
