import { createTheme } from "@mui/material/styles";

// Monochromatic coder theme - black and white with subtle accents
const palette = {
  mode: "dark",
  primary: {
    main: "#FFFFFF", // Pure white for primary elements
    light: "#F8F9FA",
    dark: "#E5E7EB",
    contrastText: "#000000",
  },
  secondary: {
    main: "#6B7280", // Subtle gray for secondary elements
    light: "#9CA3AF",
    dark: "#4B5563",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#DC2626", // Deep red for errors
    light: "#EF4444",
    dark: "#B91C1C",
  },
  warning: {
    main: "#D97706", // Amber for warnings
    light: "#F59E0B",
    dark: "#B45309",
  },
  info: {
    main: "#F3F4F6", // Light gray for info
    light: "#F9FAFB",
    dark: "#E5E7EB",
  },
  success: {
    main: "#059669", // Subtle green for success
    light: "#10B981",
    dark: "#047857",
  },
  background: {
    default: "#000000", // Pure black background
    paper: "#0A0A0A", // Very dark gray for cards
    elevated: "#111111", // Slightly lighter for elevated surfaces
  },
  text: {
    primary: "#FFFFFF", // Pure white text
    secondary: "#A1A1AA", // Light gray for secondary text
    disabled: "#52525B", // Darker gray for disabled
  },
  divider: "rgba(255, 255, 255, 0.1)",
  action: {
    active: "#FFFFFF",
    hover: "rgba(255, 255, 255, 0.05)",
    selected: "rgba(255, 255, 255, 0.08)",
    disabled: "rgba(255, 255, 255, 0.3)",
    disabledBackground: "rgba(255, 255, 255, 0.12)",
  },
};

// Monospace-focused typography for coder aesthetic
const typography = {
  fontFamily:
    '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
  monoFamily:
    '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
  h1: {
    fontFamily:
      '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
    fontSize: "3rem",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
  },
  h2: {
    fontFamily:
      '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
    fontSize: "2.5rem",
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: "-0.01em",
  },
  h3: {
    fontFamily:
      '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
    fontSize: "2rem",
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: "-0.01em",
  },
  h4: {
    fontFamily:
      '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
    fontSize: "1.5rem",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontFamily:
      '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
    fontSize: "1.25rem",
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h6: {
    fontFamily:
      '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
    fontSize: "1.125rem",
    fontWeight: 600,
    lineHeight: 1.6,
  },
  subtitle1: {
    fontFamily:
      '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
    fontSize: "1rem",
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: "0.00938em",
  },
  subtitle2: {
    fontFamily:
      '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1.57,
    letterSpacing: "0.00714em",
  },
  body1: {
    fontFamily:
      '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.75,
    letterSpacing: "0.00938em",
  },
  body2: {
    fontFamily:
      '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
    fontSize: "0.75rem",
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: "0.01071em",
  },
  button: {
    fontFamily:
      '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
    fontSize: "0.875rem",
    fontWeight: 600,
    lineHeight: 1.75,
    letterSpacing: "0.02857em",
    textTransform: "uppercase",
  },
  caption: {
    fontFamily:
      '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
    fontSize: "0.75rem",
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: "0.03333em",
  },
  overline: {
    fontFamily:
      '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
    fontSize: "0.75rem",
    fontWeight: 600,
    lineHeight: 2.66,
    letterSpacing: "0.08333em",
    textTransform: "uppercase",
  },
};

// Component overrides for monochromatic coder aesthetic
const components = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarColor: "#333333 #000000",
        "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
          borderRadius: 4,
          backgroundColor: "#333333",
          border: "1px solid #000000",
        },
        "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
          backgroundColor: "#000000",
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: "4px",
        padding: "8px 16px",
        fontWeight: 600,
        fontFamily: '"JetBrains Mono", monospace',
        transition: "all 0.2s ease-in-out",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
      },
      contained: {
        boxShadow: "none",
        border: "1px solid #333333",
        "&:hover": {
          boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
          transform: "translateY(-1px)",
        },
      },
      outlined: {
        borderWidth: "1px",
        borderColor: "#333333",
        "&:hover": {
          borderWidth: "1px",
          borderColor: "#FFFFFF",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
        borderRadius: "4px",
        border: "1px solid #333333",
        backgroundColor: "#0A0A0A",
      },
      elevation1: {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.8)",
      },
      elevation2: {
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.8)",
      },
      elevation3: {
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.8)",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: "4px",
        border: "1px solid #333333",
        backgroundColor: "#0A0A0A",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 16px rgba(255, 255, 255, 0.1)",
          borderColor: "#FFFFFF",
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: "4px",
          backgroundColor: "#111111",
          fontFamily: '"JetBrains Mono", monospace',
          "&:hover": {
            backgroundColor: "#1A1A1A",
          },
          "&.Mui-focused": {
            backgroundColor: "#1A1A1A",
          },
          "& fieldset": {
            borderColor: "#333333",
          },
          "&:hover fieldset": {
            borderColor: "#FFFFFF",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#FFFFFF",
          },
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: "1px solid #333333",
        fontFamily: '"JetBrains Mono", monospace',
      },
      head: {
        fontWeight: 600,
        backgroundColor: "#000000",
        color: "#A1A1AA",
        fontSize: "0.75rem",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        borderBottom: "2px solid #333333",
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: "4px",
        fontWeight: 600,
        fontFamily: '"JetBrains Mono", monospace',
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        fontSize: "0.7rem",
        border: "1px solid #333333",
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: "4px",
        border: "1px solid #333333",
        backgroundColor: "#0A0A0A",
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: "#000000",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #333333",
        boxShadow: "none",
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: "#0A0A0A",
        borderRight: "1px solid #333333",
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: "#1A1A1A",
        border: "1px solid #333333",
        borderRadius: "4px",
        fontSize: "0.75rem",
        fontFamily: '"JetBrains Mono", monospace',
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: "2px",
        backgroundColor: "#333333",
        "& .MuiLinearProgress-bar": {
          backgroundColor: "#FFFFFF",
        },
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      root: {
        fontFamily: '"JetBrains Mono", monospace',
      },
    },
  },
};

// Shape configuration for sharp, code-like aesthetics
const shape = {
  borderRadius: 4, // Sharp, minimal borders
};

// Create the theme
const theme = createTheme({
  palette,
  typography,
  components,
  shape,
  spacing: 8,
  transitions: {
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

export default theme;
