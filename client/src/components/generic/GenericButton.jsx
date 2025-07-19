import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material";
import { Link } from "react-router-dom";

// Modern Primary Button
export const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  padding: "10px 24px",
  borderRadius: theme.shape.borderRadius,
  textTransform: "none",
  boxShadow: "none",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "&:disabled": {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

// Modern Secondary Button
export const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "transparent",
  color: theme.palette.primary.main,
  fontWeight: 600,
  padding: "10px 24px",
  borderRadius: theme.shape.borderRadius,
  border: `1.5px solid ${theme.palette.primary.main}`,
  textTransform: "none",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: `${theme.palette.primary.main}15`,
    borderColor: theme.palette.primary.light,
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "&:disabled": {
    borderColor: theme.palette.action.disabled,
    color: theme.palette.action.disabled,
  },
}));

// Ghost Button
export const GhostButton = styled(Button)(({ theme }) => ({
  backgroundColor: "transparent",
  color: theme.palette.text.primary,
  fontWeight: 500,
  padding: "10px 24px",
  borderRadius: theme.shape.borderRadius,
  textTransform: "none",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
  "&:disabled": {
    color: theme.palette.action.disabled,
  },
}));

// Danger Button
export const DangerButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: "#FFFFFF",
  fontWeight: 600,
  padding: "10px 24px",
  borderRadius: theme.shape.borderRadius,
  textTransform: "none",
  boxShadow: "none",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${theme.palette.error.main}40`,
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "&:disabled": {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

// Icon Button with hover effect
export const IconButtonStyled = styled(Button)(({ theme }) => ({
  minWidth: "auto",
  padding: "8px",
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.secondary,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
    transform: "scale(1.1)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

// Gradient Button
export const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: "#FFFFFF",
  fontWeight: 600,
  padding: "10px 24px",
  borderRadius: theme.shape.borderRadius,
  textTransform: "none",
  boxShadow: "none",
  transition: "all 0.3s ease-in-out",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
    opacity: 0,
    transition: "opacity 0.3s ease-in-out",
  },
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 20px ${theme.palette.primary.main}40`,
    "&::before": {
      opacity: 1,
    },
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "& .MuiButton-label": {
    position: "relative",
    zIndex: 1,
  },
}));

// Legacy buttons for backward compatibility
export const WhiteBackgroundButton = ({
  buttonText,
  icon,
  selected,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Button
      variant="outlined"
      sx={{
        minWidth: "120px",
        height: "40px",
        borderRadius: theme.shape.borderRadius,
        borderColor: selected
          ? theme.palette.primary.main
          : theme.palette.divider,
        backgroundColor: selected ? theme.palette.primary.main : "transparent",
        color: selected
          ? theme.palette.primary.contrastText
          : theme.palette.text.primary,
        fontWeight: 600,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: theme.palette.primary.main,
          backgroundColor: selected
            ? theme.palette.primary.dark
            : `${theme.palette.primary.main}15`,
        },
        ...props.sx,
      }}
      {...props}
    >
      {icon && <span style={{ marginTop: 5, marginRight: 5 }}>{icon}</span>}
      {buttonText}
    </Button>
  );
};

export const BlackBackgroundButton = ({
  buttonText,
  icon,
  selected,
  disabled,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Button
      disabled={disabled}
      sx={{
        color: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        borderWidth: "1.5px",
        borderStyle: "solid",
        borderRadius: theme.shape.borderRadius,
        fontWeight: 600,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
        },
        "&:disabled": {
          color: theme.palette.action.disabled,
          borderColor: theme.palette.action.disabled,
        },
        ...props.sx,
      }}
      {...props}
    >
      {buttonText}
    </Button>
  );
};

export const WarningButton = ({ buttonText, icon, selected, ...props }) => {
  const theme = useTheme();

  return (
    <Button
      sx={{
        color: "#FFFFFF",
        backgroundColor: theme.palette.error.main,
        borderRadius: theme.shape.borderRadius,
        fontWeight: 600,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: theme.palette.error.dark,
          transform: "translateY(-2px)",
          boxShadow: `0 4px 12px ${theme.palette.error.main}40`,
        },
        "&:active": {
          transform: "translateY(0)",
        },
        ...props.sx,
      }}
      {...props}
    >
      {buttonText}
    </Button>
  );
};

export const WhiteBackgroundButtonWithInput = ({
  buttonText,
  icon,
  inputType,
  inputId,
  inputKey,
  inputOnChange,
  ...props
}) => {
  const inputRef = React.useRef(null);
  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  return (
    <Button
      variant="outlined"
      color="inherit"
      sx={{
        minWidth: "120px",
        height: "40px",
        borderRadius: "20px",
        borderColor: "black",
        color: "black",
        "&:hover": {
          borderColor: "black",
          backgroundColor: "rgba(1, 1, 1, 1)",
          color: "white",
        },
        ...props.sx,
      }}
      onClick={handleButtonClick}
      {...props}
    >
      {icon && <span style={{ marginTop: 5, marginRight: 5 }}>{icon}</span>}
      {buttonText}
      <input
        type={inputType}
        id={inputId}
        key={inputKey}
        hidden
        onChange={inputOnChange}
        ref={inputRef}
      />
    </Button>
  );
};

export const GreyBackgroundButton = ({ buttonText, icon, ...props }) => {
  const theme = useTheme();
  return (
    <Button
      variant="outlined"
      color="inherit"
      sx={{
        minWidth: "120px",
        height: "40px",
        borderRadius: theme.shape.borderRadius,
        borderColor: theme.palette.divider,
        ml: 1,
        mr: 1,
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
          color: theme.palette.text.primary,
        },
        ...props.sx,
      }}
      {...props}
    >
      {icon && <span style={{ marginTop: 5, marginRight: 5 }}>{icon}</span>}
      {buttonText}
    </Button>
  );
};

export const GreyBackgroundButtonWithInput = ({
  buttonText,
  icon,
  inputType,
  inputId,
  inputKey,
  inputOnChange,
  ...props
}) => {
  const theme = useTheme();
  const inputRef = React.useRef(null);
  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  return (
    <Button
      variant="outlined"
      color="inherit"
      sx={{
        minWidth: "120px",
        height: "40px",
        borderRadius: theme.shape.borderRadius,
        borderColor: theme.palette.divider,
        ml: 1,
        mr: 1,
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
          color: theme.palette.text.primary,
        },
        ...props.sx,
      }}
      onClick={handleButtonClick}
      {...props}
    >
      {icon && <span style={{ marginTop: 5, marginRight: 5 }}>{icon}</span>}
      {buttonText}
      <input
        type={inputType}
        id={inputId}
        key={inputKey}
        hidden
        onChange={inputOnChange}
        ref={inputRef}
      />
    </Button>
  );
};

export const LightGreyBackgroundButton = ({
  buttonText,
  icon,
  selected,
  ...props
}) => {
  const theme = useTheme();
  return (
    <Button
      variant="outlined"
      color="inherit"
      sx={{
        minWidth: "120px",
        height: "40px",
        borderRadius: theme.shape.borderRadius,
        borderColor: selected
          ? theme.palette.primary.main
          : theme.palette.divider,
        backgroundColor: selected
          ? theme.palette.action.selected
          : "transparent",
        color: selected
          ? theme.palette.primary.main
          : theme.palette.text.primary,
        "&:hover": {
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.action.hover,
          color: theme.palette.primary.main,
        },
        ...props.sx,
      }}
      {...props}
    >
      {icon && <span style={{ marginTop: 5, marginRight: 5 }}>{icon}</span>}
      {buttonText}
    </Button>
  );
};

export const SmallNarrowButton = ({ buttonText, icon, selected, ...props }) => {
  return (
    <Button
      component={Link}
      to="/upgrade"
      size="small"
      sx={{
        minWidth: "40px",
        padding: "4px",
        fontSize: "0.75rem",
        lineHeight: 1,
        backgroundColor: "#B9F2FF",
        color: "black",
        "&:hover": {
          borderColor: "#00FF00",
          backgroundColor: "#00FF00",
          color: "black",
        },
      }}
    >
      {buttonText}
    </Button>
  );
};
