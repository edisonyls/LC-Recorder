import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const Welcome = ({ user }) => {
  const theme = useTheme();

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6 || hour > 23) return "// Night Owl Mode";
    if (hour < 12) return "// Good Morning";
    if (hour < 18) return "// Good Afternoon";
    return "// Good Evening";
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: "easeOut",
      },
    }),
  };

  return (
    <Box
      component={motion.div}
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
          {"// Welcome back to your coding journey tracker"}
          <br />
          {
            "// Keep pushing forward, every problem solved is a step closer to mastery"
          }
          <br />
          {"// Your dedication today shapes your expertise tomorrow"}
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
                color: theme.palette.text.disabled,
                fontFamily: theme.typography.monoFamily,
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
              }}
            >
              0 days
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.disabled,
                fontFamily: theme.typography.monoFamily,
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
              }}
            >
              0
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.disabled,
                fontFamily: theme.typography.monoFamily,
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
              }}
            >
              0%
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Welcome;
