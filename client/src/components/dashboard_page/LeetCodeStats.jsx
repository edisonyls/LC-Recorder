import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { axiosInstance } from "../../config/axiosConfig";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CodeIcon from "@mui/icons-material/Code";
import TimerIcon from "@mui/icons-material/Timer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import moment from "moment";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import ReactTooltip from "react-tooltip";

const LeetCodeStats = ({ userId, stats: propsStats }) => {
  const theme = useTheme();
  const [stats, setStats] = useState(propsStats);
  const [loading, setLoading] = useState(!propsStats);

  useEffect(() => {
    if (propsStats) {
      setStats(propsStats);
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get(`/question/stats/${userId}`);
        const actualStats = response.data.data || response.data;
        setStats(actualStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchStats();
    }
  }, [userId, propsStats]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            No statistics available yet
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const difficultyData = [
    {
      name: "Easy",
      value:
        stats.difficultyDistribution?.find((d) => d.difficulty === "Easy")
          ?.count || 0,
      color: theme.palette.success.main,
    },
    {
      name: "Medium",
      value:
        stats.difficultyDistribution?.find((d) => d.difficulty === "Medium")
          ?.count || 0,
      color: theme.palette.warning.main,
    },
    {
      name: "Hard",
      value:
        stats.difficultyDistribution?.find((d) => d.difficulty === "Hard")
          ?.count || 0,
      color: theme.palette.error.main,
    },
  ];

  const totalProblems = stats.questionCount || 0;
  const solvedProblems =
    stats.successDistribution?.find((s) => s.success === 1)?.count || 0;
  const successRate =
    totalProblems > 0 ? (solvedProblems / totalProblems) * 100 : 0;

  // Calculate average time across all difficulties
  const avgTime = (() => {
    if (
      !stats.averageTimeOfCompletion ||
      stats.averageTimeOfCompletion.length === 0
    ) {
      return 0;
    }

    const difficultyCounts = stats.difficultyDistribution || [];

    let totalTimeMinutes = 0;
    let totalProblems = 0;

    stats.averageTimeOfCompletion.forEach((item) => {
      const difficultyCount =
        difficultyCounts.find((d) => d.difficulty === item.difficulty)?.count ||
        0;

      // Convert time from "MM:SS" format to minutes
      let timeInMinutes = 0;
      if (item.averageTime && typeof item.averageTime === "string") {
        const [minutes, seconds] = item.averageTime.split(":").map(Number);
        timeInMinutes = minutes + seconds / 60;
      } else if (typeof item.averageTime === "number") {
        timeInMinutes = item.averageTime;
      }

      totalTimeMinutes += timeInMinutes * difficultyCount;
      totalProblems += difficultyCount;
    });

    return totalProblems > 0 ? totalTimeMinutes / totalProblems : 0;
  })();

  const StatCard = ({ icon, title, value, subtitle, color }) => (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 24px ${color}20`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: `${color}20`,
              color: color,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: color,
            mb: 1,
          }}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.primary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CodeIcon sx={{ color: theme.palette.primary.main }} />
        LeetCode Statistics
      </Typography>

      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CodeIcon />}
            title="Total Problems"
            value={totalProblems}
            subtitle="All time"
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<EmojiEventsIcon />}
            title="Solved"
            value={solvedProblems}
            subtitle={`${successRate.toFixed(1)}% success rate`}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TimerIcon />}
            title="Avg Time"
            value={`${Math.round(avgTime)}m`}
            subtitle="Per problem"
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingUpIcon />}
            title="Starred"
            value={stats.starredCount || 0}
            subtitle="Favorite problems"
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 2 }}>
        {/* Difficulty Distribution Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Difficulty Distribution
              </Typography>
              {difficultyData.some((item) => item.value > 0) ? (
                <Chart
                  options={{
                    chart: {
                      type: "donut",
                    },
                    colors: difficultyData.map((item) => item.color),
                    labels: difficultyData.map((item) => item.name),
                    legend: {
                      position: "bottom",
                      labels: {
                        colors: "white",
                      },
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val) {
                        return Math.round(val) + "%";
                      },
                    },
                    plotOptions: {
                      pie: {
                        donut: {
                          size: "65%",
                        },
                      },
                    },
                  }}
                  series={difficultyData.map((item) => item.value)}
                  type="donut"
                  height={250}
                />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 250,
                    color: theme.palette.text.secondary,
                  }}
                >
                  <Typography variant="body2">No data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Success vs Failure Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Success Rate
              </Typography>
              {stats.successDistribution &&
              stats.successDistribution.length > 0 ? (
                <Chart
                  options={{
                    chart: {
                      type: "donut",
                    },
                    colors: [
                      theme.palette.success.main,
                      theme.palette.error.main,
                    ],
                    labels: ["Solved", "Unsolved"],
                    legend: {
                      position: "bottom",
                      labels: {
                        colors: "white",
                      },
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val) {
                        return Math.round(val) + "%";
                      },
                    },
                    plotOptions: {
                      pie: {
                        donut: {
                          size: "65%",
                        },
                      },
                    },
                  }}
                  series={[
                    stats.successDistribution.find((s) => s.success === 1)
                      ?.count || 0,
                    stats.successDistribution.find((s) => s.success === 0)
                      ?.count || 0,
                  ]}
                  type="donut"
                  height={250}
                />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 250,
                    color: theme.palette.text.secondary,
                  }}
                >
                  <Typography variant="body2">No data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Average Time by Difficulty Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Average Time by Difficulty
              </Typography>
              {stats.averageTimeOfCompletion &&
              stats.averageTimeOfCompletion.length > 0 ? (
                <Chart
                  options={{
                    chart: {
                      type: "bar",
                    },
                    colors: [
                      theme.palette.success.main,
                      theme.palette.warning.main,
                      theme.palette.error.main,
                    ],
                    xaxis: {
                      categories: stats.averageTimeOfCompletion.map(
                        (item) => item.difficulty
                      ),
                      labels: {
                        style: {
                          colors: "white",
                        },
                      },
                    },
                    yaxis: {
                      title: {
                        text: "Time (minutes)",
                      },
                      labels: {
                        style: {
                          colors: "white",
                        },
                      },
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val) {
                        return Math.round(val) + "m";
                      },
                    },
                    tooltip: {
                      enabled: false,
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 4,
                        horizontal: false,
                      },
                    },
                  }}
                  series={[
                    {
                      name: "Average Time",
                      data: stats.averageTimeOfCompletion.map((item) => {
                        // Convert time from "MM:SS" format to minutes
                        let timeInMinutes = 0;
                        if (
                          item.averageTime &&
                          typeof item.averageTime === "string"
                        ) {
                          const [minutes, seconds] = item.averageTime
                            .split(":")
                            .map(Number);
                          timeInMinutes = minutes + seconds / 60;
                        } else if (typeof item.averageTime === "number") {
                          timeInMinutes = item.averageTime;
                        }
                        return Math.round(timeInMinutes);
                      }),
                    },
                  ]}
                  type="bar"
                  height={250}
                />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 250,
                    color: theme.palette.text.secondary,
                  }}
                >
                  <Typography variant="body2">No data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 2 }}>
        {/* Activity Heatmap - now full width */}
        <Grid item xs={12} md={12}>
          <Card sx={{ height: "auto", minHeight: "200px" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Activity Heatmap
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  "& .react-calendar-heatmap": {
                    width: "100%",
                    maxWidth: "600px",
                    margin: "0 auto",
                  },
                  "& .react-calendar-heatmap text": {
                    fill: "white",
                    fontSize: "6px",
                  },
                  "& .react-calendar-heatmap .color-empty": {
                    fill: "#fff",
                  },
                  "& .react-calendar-heatmap .color-github-1": {
                    fill: "#9be9a8",
                  },
                  "& .react-calendar-heatmap .color-github-2": {
                    fill: "#40c463",
                  },
                  "& .react-calendar-heatmap .color-github-3": {
                    fill: "#30a14e",
                  },
                  "& .react-calendar-heatmap .color-github-4": {
                    fill: "#216e39",
                  },
                  "& .react-calendar-heatmap rect": {
                    pointerEvents: "auto",
                    cursor: "default",
                    width: "8px",
                    height: "8px",
                  },
                  "& .react-calendar-heatmap rect:focus": {
                    outline: "none",
                  },
                  "& .react-calendar-heatmap rect:hover": {
                    stroke: "#333",
                    strokeWidth: 1,
                    cursor: "pointer",
                  },
                  "& .__react_component_tooltip": {
                    backgroundColor: "#333",
                    color: "white",
                    borderRadius: "4px",
                    padding: "6px 6px",
                    fontSize: "10px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  },
                }}
              >
                <CalendarHeatmap
                  startDate={moment().subtract(6, "months").toDate()}
                  endDate={new Date()}
                  values={stats.createdAtStats.map((item) => ({
                    date: item.dateOfCompletion,
                    count: item.count,
                  }))}
                  classForValue={(value) => {
                    if (!value) return "color-empty";
                    if (value.count >= 3) return "color-github-4";
                    if (value.count === 2) return "color-github-3";
                    if (value.count === 1) return "color-github-2";
                    return "color-github-1";
                  }}
                  tooltipDataAttrs={(value) => ({
                    "data-tip": value.date
                      ? `${value.count} questions recorded on ${moment(
                          value.date
                        ).format("MMM Do")}`
                      : "No question recorded",
                  })}
                />
                <ReactTooltip
                  place="top"
                  type="dark"
                  effect="solid"
                  offset={{ top: 8 }}
                />
                <Box
                  mt={1}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    flexWrap: "wrap",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                >
                  <span>Less</span>
                  <Box
                    sx={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#fff",
                      borderRadius: "1px",
                    }}
                  />
                  <Box
                    sx={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#9be9a8",
                      borderRadius: "1px",
                    }}
                  />
                  <Box
                    sx={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#40c463",
                      borderRadius: "1px",
                    }}
                  />
                  <Box
                    sx={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#30a14e",
                      borderRadius: "1px",
                    }}
                  />
                  <Box
                    sx={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#216e39",
                      borderRadius: "1px",
                    }}
                  />
                  <span>More</span>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress Overview Section */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Progress Overview
          </Typography>
          {totalProblems > 0 ? (
            <Grid container spacing={3}>
              {difficultyData.map((item) => (
                <Grid item xs={12} md={4} key={item.name}>
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.main }}
                      >
                        {item.value} problems
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(item.value / totalProblems) * 100 || 0}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: `${item.color}20`,
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: item.color,
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No problems solved yet. Your progress will appear here once you
                start solving problems.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default LeetCodeStats;
