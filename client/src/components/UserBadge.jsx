import React from "react";
import { Box, Typography, useTheme, Tooltip } from "@mui/material";
import {
  WorkspacePremium,
  Person,
  AdminPanelSettings,
  AutoAwesome,
  Diamond,
} from "@mui/icons-material";

const UserBadge = ({ role }) => {
  const theme = useTheme();

  const getBadgeConfig = () => {
    switch (role) {
      case "ADMIN":
        return {
          label: "ADMIN",
          icon: <AdminPanelSettings sx={{ fontSize: "0.9rem" }} />,
          gradient: `linear-gradient(135deg, 
            rgba(220, 38, 38, 0.9) 0%, 
            rgba(217, 119, 6, 0.9) 50%, 
            rgba(239, 68, 68, 0.9) 100%)`,
          glowColor: "#DC2626",
          borderColor: "#EF4444",
          textColor: "#FFFFFF",
          iconColor: "#FFFFFF",
          sparkles: true,
        };
      case "PREPLUS":
        return {
          label: "Premium+",
          icon: <Diamond sx={{ fontSize: "0.9rem" }} />,
          gradient: `linear-gradient(135deg, 
            rgba(147, 51, 234, 0.9) 0%, 
            rgba(217, 119, 6, 0.9) 30%, 
            rgba(245, 158, 11, 0.9) 70%, 
            rgba(168, 85, 247, 0.9) 100%)`,
          glowColor: "#A855F7",
          borderColor: "#F59E0B",
          textColor: "#FFFFFF",
          iconColor: "#FFFFFF",
          sparkles: true,
          premium: true,
        };
      case "PREMIUM":
        return {
          label: "Premium",
          icon: <WorkspacePremium sx={{ fontSize: "0.9rem" }} />,
          gradient: `linear-gradient(135deg, 
            rgba(59, 130, 246, 0.9) 0%, 
            rgba(147, 51, 234, 0.9) 50%, 
            rgba(99, 102, 241, 0.9) 100%)`,
          glowColor: "#3B82F6",
          borderColor: "#6366F1",
          textColor: "#FFFFFF",
          iconColor: "#FFFFFF",
          sparkles: false,
        };
      default:
        return {
          label: "FREE",
          icon: <Person sx={{ fontSize: "0.9rem" }} />,
          gradient: `linear-gradient(135deg, 
            rgba(107, 114, 128, 0.8) 0%, 
            rgba(75, 85, 99, 0.8) 100%)`,
          glowColor: "transparent",
          borderColor: theme.palette.divider,
          textColor: theme.palette.text.primary,
          iconColor: theme.palette.text.secondary,
          sparkles: false,
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <Tooltip title={`${config.label} Member`} placement="top" arrow>
      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          height: 24,
          borderRadius: "12px",
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-1px) scale(1.02)",
            filter: "brightness(1.1)",
            boxShadow: `0 4px 12px -2px ${config.glowColor}40, 0 0 0 1px ${config.borderColor}60`,
          },
        }}
      >
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: config.gradient,
            zIndex: 1,
          }}
        />

        {/* Glassmorphism Effect */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backdropFilter: "blur(8px)",
            border: `1px solid ${config.borderColor}50`,
            borderRadius: "12px",
            zIndex: 2,
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            padding: "2px 8px",
            zIndex: 3,
            width: "100%",
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: config.iconColor,
              filter: config.sparkles
                ? `drop-shadow(0 0 2px ${config.glowColor})`
                : "none",
            }}
          >
            {config.icon}
          </Box>

          {/* Text */}
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontSize: "0.6rem",
              letterSpacing: "0.05em",
              color: config.textColor,
              lineHeight: 1,
              textShadow: config.sparkles
                ? `0 0 4px ${config.glowColor}40`
                : "none",
            }}
          >
            {config.label}
          </Typography>

          {config.sparkles && (
            <Box
              sx={{
                color: config.iconColor,
                animation: "sparkle 1.5s ease-in-out infinite alternate",
                "@keyframes sparkle": {
                  "0%": {
                    transform: "scale(0.7) rotate(0deg)",
                    opacity: 0.5,
                  },
                  "100%": {
                    transform: "scale(1) rotate(180deg)",
                    opacity: 1,
                  },
                },
              }}
            >
              <AutoAwesome sx={{ fontSize: "0.6rem" }} />
            </Box>
          )}
        </Box>

        {(config.premium || config.sparkles) && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: `linear-gradient(
                90deg,
                transparent 0%,
                rgba(255, 255, 255, 0.2) 50%,
                transparent 100%
              )`,
              animation: "shine 2.5s ease-in-out infinite",
              zIndex: 4,
              "@keyframes shine": {
                "0%": {
                  left: "-100%",
                },
                "50%": {
                  left: "100%",
                },
                "100%": {
                  left: "100%",
                },
              },
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
};

export default UserBadge;
