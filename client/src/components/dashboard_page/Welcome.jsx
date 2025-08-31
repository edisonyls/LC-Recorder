import React from "react";
import { Box, Typography, useTheme, Button, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CodeIcon from "@mui/icons-material/Code";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SecurityIcon from "@mui/icons-material/Security";
import SpaIcon from "@mui/icons-material/Spa";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarIcon from "@mui/icons-material/Star";

const Welcome = ({ user, stats }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentStreak = 0, totalProblems = 0, successRate = 0 } = stats || {};

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6 || hour > 23) return "// Night Owl Mode";
    if (hour < 12) return "// Good Morning";
    if (hour < 18) return "// Good Afternoon";
    return "// Good Evening";
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMotivationalMessage = () => {
    if (currentStreak >= 7) {
      return {
        text: "You're on fire! Keep the momentum going!",
        icon: WhatshotIcon,
        color: "#FF4500",
      };
    } else if (currentStreak >= 3) {
      return {
        text: "Building a solid habit! Stay consistent!",
        icon: FitnessCenterIcon,
        color: "#32CD32",
      };
    } else if (totalProblems >= 50) {
      return {
        text: "Experienced coder! Challenge yourself with harder problems!",
        icon: RocketLaunchIcon,
        color: "#FF6B35",
      };
    } else if (totalProblems >= 10) {
      return {
        text: "Making progress! Every problem counts!",
        icon: TrendingUpIcon,
        color: "#4ECDC4",
      };
    } else {
      return {
        text: "Starting your coding journey! You've got this!",
        icon: StarIcon,
        color: "#FFD700",
      };
    }
  };

  const getUserLevel = () => {
    if (totalProblems >= 100)
      return { level: "Expert", color: "#FFD700", icon: WorkspacePremiumIcon };
    if (totalProblems >= 50)
      return { level: "Advanced", color: "#FF6B35", icon: RocketLaunchIcon };
    if (totalProblems >= 20)
      return { level: "Intermediate", color: "#4ECDC4", icon: FlashOnIcon };
    if (totalProblems >= 5)
      return { level: "Beginner", color: "#95E1D3", icon: SpaIcon };
    return { level: "Newbie", color: "#B9F2FF", icon: SecurityIcon };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: {
        duration: 0.2,
        delay: i * 0.05,
        ease: "easeOut",
      },
    }),
  };

  return (
    <Box
      component={motion.div}
      layoutId="welcome-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        background: theme.palette.background.paper,
        borderRadius: 1,
        p: 4,
        mb: 4,
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
        width: "100%",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Main Grid Layout */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: 4,
            alignItems: "start",
          }}
        >
          {/* Left Column - Main Content */}
          <Box>
            <Typography
              component={motion.div}
              custom={0}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              variant="h3"
              sx={{
                fontWeight: 400,
                mb: 2,
                color: theme.palette.text.secondary,
                fontFamily: theme.typography.monoFamily,
              }}
            >
              {getTimeOfDayGreeting()}
            </Typography>

            <Typography
              component={motion.div}
              custom={1}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: theme.palette.text.primary,
                fontFamily: theme.typography.monoFamily,
              }}
            >
              user.{user.firstName?.toLowerCase()}.
              {user.lastName?.toLowerCase()}
            </Typography>

            <Box
              component={motion.div}
              custom={2}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                gap: 1.5,
              }}
            >
              {React.createElement(getMotivationalMessage().icon, {
                sx: {
                  fontSize: "1.5rem",
                  color: getMotivationalMessage().color,
                },
              })}
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.8,
                  fontFamily: theme.typography.monoFamily,
                }}
              >
                {getMotivationalMessage().text}
              </Typography>
            </Box>

            {/* Quick Stats Row */}
            <Box
              component={motion.div}
              custom={3}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
                mb: 4,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontFamily: theme.typography.monoFamily,
                    fontSize: "12px",
                  }}
                >
                  current_streak
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    fontFamily: theme.typography.monoFamily,
                    textAlign: "center",
                  }}
                >
                  {currentStreak} days
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontFamily: theme.typography.monoFamily,
                    fontSize: "12px",
                  }}
                >
                  total_problems
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    fontFamily: theme.typography.monoFamily,
                    textAlign: "center",
                  }}
                >
                  {totalProblems}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontFamily: theme.typography.monoFamily,
                    fontSize: "12px",
                  }}
                >
                  success_rate
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    fontFamily: theme.typography.monoFamily,
                    textAlign: "center",
                  }}
                >
                  {successRate.toFixed(1)}%
                </Typography>
              </Box>
            </Box>

            {/* Action Button */}
            <Box
              component={motion.div}
              custom={4}
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              <Button
                variant="contained"
                startIcon={<CodeIcon />}
                onClick={() => navigate("/table")}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontFamily: theme.typography.monoFamily,
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  textTransform: "none",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                    transform: "translateY(-1px)",
                    boxShadow: theme.shadows[4],
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                View Recorded Problems
              </Button>
            </Box>
          </Box>

          {/* Right Column - User Info & Achievements */}
          <Box
            component={motion.div}
            custom={5}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            sx={{
              display: { xs: "none", lg: "block" },
            }}
          >
            {/* User Level Card */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${
                  getUserLevel().color
                }20, ${getUserLevel().color}10)`,
                border: `1px solid ${getUserLevel().color}40`,
                borderRadius: 2,
                p: 3,
                mb: 3,
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                {React.createElement(getUserLevel().icon, {
                  sx: {
                    fontSize: "2.5rem",
                    color: getUserLevel().color,
                  },
                })}
              </Box>
              <Chip
                label={getUserLevel().level}
                sx={{
                  backgroundColor: getUserLevel().color,
                  color: theme.palette.background.paper,
                  fontWeight: 600,
                  fontFamily: theme.typography.monoFamily,
                  mb: 1,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontFamily: theme.typography.monoFamily,
                }}
              >
                Your coding level
              </Typography>
            </Box>

            {/* Today's Info */}
            <Box
              sx={{
                background: theme.palette.background.default,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                p: 3,
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CalendarTodayIcon
                  sx={{
                    color: theme.palette.primary.main,
                    mr: 1,
                    fontSize: "1.2rem",
                  }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: theme.typography.monoFamily,
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  Today
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontFamily: theme.typography.monoFamily,
                  lineHeight: 1.4,
                }}
              >
                {getCurrentDate()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Welcome;
