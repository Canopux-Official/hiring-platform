import { createTheme, alpha } from "@mui/material/styles";

const emerald = "#34d39e";
const emeraldDeep = "#0fae7c";
const bg = "#0c1014";
const surface = "#141a21";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: emerald, dark: emeraldDeep, contrastText: "#06140f" },
    secondary: { main: "#7c9cff" },
    background: { default: bg, paper: surface },
    text: { primary: "#e8eef5", secondary: "#a4b1c2" },
    divider: alpha("#ffffff", 0.08),
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    h1: { fontWeight: 800, letterSpacing: "-0.03em" },
    h2: { fontWeight: 800, letterSpacing: "-0.025em" },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, paddingInline: 18 },
        containedPrimary: {
          background: `linear-gradient(135deg, ${emerald}, ${emeraldDeep})`,
          boxShadow: `0 10px 30px -10px ${alpha(emerald, 0.6)}`,
          "&:hover": { background: `linear-gradient(135deg, ${emerald}, ${emeraldDeep})`, filter: "brightness(1.05)" },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: `linear-gradient(180deg, ${alpha("#1a222b", 0.7)}, ${alpha("#0f151b", 0.6)})`,
          border: `1px solid ${alpha("#ffffff", 0.06)}`,
          backdropFilter: "blur(14px)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
  },
});

export const glass = {
  background: alpha("#1a222b", 0.55),
  border: `1px solid ${alpha("#ffffff", 0.08)}`,
  backdropFilter: "blur(16px)",
  borderRadius: 16,
};

export const emeraldGlow = `0 0 80px -10px ${alpha(emerald, 0.55)}, inset 0 0 0 1px ${alpha(emerald, 0.35)}`;
