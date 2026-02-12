import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: ["Inter"].join(","),
  },
  palette: {
    primary: {
      main: "#2B3C29",
    },
    secondary: {
      main: "#F1EEC0",
    },
  },
});

export default theme;
