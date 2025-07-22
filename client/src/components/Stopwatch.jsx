import React, { useState, useEffect } from "react";
import { IconButton, Box, Typography, Tooltip, Paper, Chip } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReplayIcon from "@mui/icons-material/Replay";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TimerIcon from "@mui/icons-material/Timer";
import { GenericDialog } from "./generic/GenericDialog";

const MAX_TIME = 59999;

const Stopwatch = ({ onTimeSubmit }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [openFinishDialog, setOpenFinishDialog] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const [pausedTime, setPausedTime] = useState(0);

  useEffect(() => {
    let interval = null;
    let lastSecond = 0;

    if (isRunning) {
      interval = setInterval(() => {
        const now = Date.now();
        const deltaTime = now - startTime;
        const newTime = Math.floor(deltaTime / 1000);

        if (newTime > lastSecond) {
          lastSecond = newTime;
          if (newTime >= MAX_TIME) {
            setTime(MAX_TIME);
            setIsRunning(false);
            clearInterval(interval);
          } else {
            setTime(newTime);
          }
        }
      }, 100);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handlePauseResume = () => {
    if (isRunning) {
      setIsRunning(false);
      setPausedTime(Date.now() - startTime);
    } else {
      setStartTime(Date.now() - pausedTime);
      setIsRunning(true);
      setPausedTime(0);
    }
  };

  const handleFinish = () => {
    setIsRunning(false);
    setPausedTime(Date.now() - startTime);
    setOpenFinishDialog(true);
  };

  const handleConfirmTime = () => {
    onTimeSubmit(formatTime());
    setOpenFinishDialog(false);
  };

  const handleReset = () => {
    setTime(0);
    setStartTime(Date.now());
    setIsRunning(true);
    setOpenResetDialog(false);
  };

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "12px 16px",
          borderRadius: "12px",
          marginBottom: "16px",
          backgroundColor: "background.paper",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          gap: 2,
        }}
      >
        <TimerIcon 
          sx={{ 
            color: isRunning ? "success.main" : "text.secondary",
            fontSize: "1.2rem"
          }} 
        />
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Time:
          </Typography>
          <Chip
            label={formatTime()}
            variant="outlined"
            size="small"
            sx={{
              fontFamily: "monospace",
              fontWeight: 600,
              fontSize: "0.875rem",
              backgroundColor: isRunning ? "success.light" : "background.default",
              color: isRunning ? "success.dark" : "text.primary",
              borderColor: isRunning ? "success.main" : "divider",
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 0.5, marginLeft: "auto" }}>
          <Tooltip title={isRunning ? "Pause" : "Resume"}>
            <IconButton 
              size="small"
              onClick={handlePauseResume}
              sx={{
                color: isRunning ? "warning.main" : "success.main",
                "&:hover": {
                  backgroundColor: isRunning ? "warning.light" : "success.light",
                }
              }}
            >
              {isRunning ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Reset Timer">
            <IconButton
              size="small"
              onClick={() => setOpenResetDialog(true)}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: "action.hover",
                  color: "primary.main",
                }
              }}
            >
              <ReplayIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Finish & Submit Time">
            <IconButton 
              size="small"
              onClick={handleFinish}
              sx={{
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.light",
                  color: "primary.dark",
                }
              }}
            >
              <CheckCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
      <GenericDialog
        isOpen={openFinishDialog}
        onClose={() => setOpenFinishDialog(false)}
        onConfirm={handleConfirmTime}
        title="Time of Completion"
        content="Do you want to pass this time to the Time of Completion field?"
      />
      <GenericDialog
        isOpen={openResetDialog}
        onClose={() => setOpenResetDialog(false)}
        onConfirm={handleReset}
        title="Reset Recording"
        content="Do you want to reset time recording?"
      />
    </>
  );
};

export default Stopwatch;
