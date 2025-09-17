import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  useTheme,
  Tooltip,
} from "@mui/material";

import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Timer as TimerIcon,
  CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material";

function QuestionsTable({ questions, onDelete, onToggleStar }) {
  const navigate = useNavigate();
  const theme = useTheme();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return theme.palette.success.main;
      case "Medium":
        return theme.palette.warning.main;
      case "Hard":
        return theme.palette.error.main;
      default:
        return theme.palette.text.primary;
    }
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    if (typeof time === "string" && time.includes(":")) {
      return time;
    }

    if (typeof time === "number") {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    const numTime = parseFloat(time);
    if (!isNaN(numTime)) {
      const minutes = Math.floor(numTime / 60);
      const seconds = numTime % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    return time;
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: theme.palette.background.paper,
        backgroundImage: "none",
        overflow: "auto",
        maxHeight: "70vh",
        width: "100%",
      }}
    >
      <Table sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ width: 60, minWidth: 60 }} />
            <TableCell sx={{ width: 120, minWidth: 120 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarTodayIcon
                  sx={{ fontSize: 16, color: theme.palette.text.secondary }}
                />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Date
                </Typography>
              </Box>
            </TableCell>
            <TableCell sx={{ minWidth: 300, maxWidth: 400 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Problem
              </Typography>
            </TableCell>
            <TableCell align="center" sx={{ width: 100, minWidth: 100 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Difficulty
              </Typography>
            </TableCell>
            <TableCell align="center" sx={{ width: 80, minWidth: 80 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Status
              </Typography>
            </TableCell>
            <TableCell align="center" sx={{ width: 90, minWidth: 90 }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Attempts
              </Typography>
            </TableCell>
            <TableCell align="center" sx={{ width: 90, minWidth: 90 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                }}
              >
                <TimerIcon
                  sx={{ fontSize: 16, color: theme.palette.text.secondary }}
                />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Time
                </Typography>
              </Box>
            </TableCell>
            <TableCell align="center" sx={{ width: 60, minWidth: 60 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.length > 0 ? (
            questions.map((question) => (
              <TableRow
                key={question.id}
                hover
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                  "& td": {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  },
                }}
                onClick={() =>
                  navigate(`/question/${question.id}`, {
                    state: { id: question.id },
                  })
                }
              >
                <TableCell align="center">
                  <Tooltip
                    title={
                      question.star
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <IconButton
                      size="small"
                      onClick={(event) => onToggleStar(question.id, event)}
                      sx={{
                        color: question.star
                          ? theme.palette.warning.main
                          : theme.palette.text.secondary,
                        "&:hover": {
                          backgroundColor: "rgba(255, 191, 0, 0.08)",
                        },
                      }}
                    >
                      {question.star ? (
                        <StarIcon fontSize="small" />
                      ) : (
                        <StarBorderIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={question.dateOfCompletion}
                  >
                    {question.dateOfCompletion}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        fontFamily: theme.typography.monoFamily,
                        wordBreak: "break-word",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.3,
                      }}
                      title={`${question.number}. ${question.title}`}
                    >
                      {question.number}. {question.title}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={question.difficulty}
                    size="small"
                    sx={{
                      backgroundColor: `${getDifficultyColor(
                        question.difficulty
                      )}20`,
                      color: getDifficultyColor(question.difficulty),
                      border: `1px solid ${getDifficultyColor(
                        question.difficulty
                      )}40`,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  {question.success ? (
                    <Tooltip title="Solved">
                      <CheckCircleIcon
                        sx={{
                          color: theme.palette.success.main,
                          fontSize: 20,
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Not solved">
                      <CancelIcon
                        sx={{
                          color: theme.palette.error.main,
                          fontSize: 20,
                        }}
                      />
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color:
                        question.attempts > 3
                          ? theme.palette.warning.main
                          : theme.palette.text.primary,
                    }}
                  >
                    {question.attempts}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: theme.typography.monoFamily,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {formatTime(question.timeOfCompletion)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Delete problem">
                    <IconButton
                      size="small"
                      onClick={(event) => onDelete(question.id, event)}
                      sx={{
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          color: theme.palette.error.main,
                          backgroundColor: "rgba(248, 113, 113, 0.08)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 1,
                    }}
                  >
                    No problems recorded yet
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.disabled,
                    }}
                  >
                    Start by adding your first LeetCode problem
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default QuestionsTable;
