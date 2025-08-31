import React from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CodeIcon from "@mui/icons-material/Code";

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
          user.{user.firstName?.toLowerCase()}.{user.lastName?.toLowerCase()}
        </Typography>

        <Typography
          component={motion.div}
          custom={2}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: 600,
            lineHeight: 1.8,
            fontFamily: theme.typography.monoFamily,
          }}
        >
          {"Welcome back to your coding journey tracker"}
          <br />
          {
            "Keep pushing forward, every problem solved is a step closer to mastery"
          }
          <br />
          {"Your dedication today shapes your expertise tomorrow"}
        </Typography>

        <Box
          component={motion.div}
          custom={3}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          sx={{
            mt: 4,
            display: "flex",
            gap: 3,
            flexWrap: "wrap",
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
              🔥 current_streak
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
              📊 total_problems
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
              🎯 success_rate
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

        <Box
          component={motion.div}
          custom={4}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "flex-start",
          }}
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
    </Box>
  );
};

export default Welcome;
