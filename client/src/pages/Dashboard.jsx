import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticatedNavbar from "../components/navbar/AuthenticatedNavbar";
import Footer from "../components/Footer";
import { useUser } from "../context/userContext";
import { UserHooks } from "../hooks/userHooks/UserHooks";
import Welcome from "../components/dashboard_page/Welcome";
import LeetCodeStats from "../components/dashboard_page/LeetCodeStats";
import DataStructureStats from "../components/dashboard_page/DataStructureStats";
import AlgorithmStats from "../components/dashboard_page/AlgorithmStats";
import { grey } from "@mui/material/colors";
import { axiosInstance } from "../config/axiosConfig";
import moment from "moment";

const Dashboard = () => {
  const { state } = useUser();
  const { user, token } = state;
  const { getCurrentUser } = UserHooks();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser(token);
  }, []); // eslint-disable-line

  useEffect(() => {
    const fetchStats = async () => {
      if (user.id && user.role !== "REGULAR") {
        try {
          const response = await axiosInstance.get(
            `/question/stats/${user.id}`
          );
          const actualStats = response.data.data || response.data;
          setStats(actualStats);
        } catch (error) {
          console.error("Error fetching stats:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (user.id) {
      fetchStats();
    }
  }, [user.id, user.role]);

  // Calculate current streak
  const calculateCurrentStreak = () => {
    if (!stats?.createdAtStats || stats.createdAtStats.length === 0) {
      console.log("No stats data available for streak calculation");
      return 0;
    }

    const today = moment().startOf("day");
    let currentStreak = 0;

    console.log("Calculating streak with data:", stats.createdAtStats);

    // Sort dates in descending order and remove duplicates
    const uniqueDates = [
      ...new Set(
        stats.createdAtStats.map((item) =>
          moment(item.dateOfCompletion).format("YYYY-MM-DD")
        )
      ),
    ]
      .map((dateStr) => moment(dateStr, "YYYY-MM-DD"))
      .sort((a, b) => b.valueOf() - a.valueOf());

    console.log(
      "Unique dates for streak calculation:",
      uniqueDates.map((d) => d.format("YYYY-MM-DD"))
    );

    // Check if there's activity today
    const hasActivityToday = uniqueDates.some((date) =>
      date.isSame(today, "day")
    );

    console.log("Has activity today:", hasActivityToday);

    if (hasActivityToday) {
      currentStreak = 1;
      let currentDate = today.subtract(1, "day");

      // Count consecutive days backwards
      for (const activityDate of uniqueDates) {
        if (activityDate.isSame(currentDate, "day")) {
          currentStreak++;
          currentDate = currentDate.subtract(1, "day");
        } else if (activityDate.isBefore(currentDate, "day")) {
          // Found a gap, break the streak
          break;
        }
      }
    } else {
      // No activity today, check for yesterday and count backwards
      let currentDate = today.subtract(1, "day");

      for (const activityDate of uniqueDates) {
        if (activityDate.isSame(currentDate, "day")) {
          currentStreak++;
          currentDate = currentDate.subtract(1, "day");
        } else if (activityDate.isBefore(currentDate, "day")) {
          // Found a gap, break the streak
          break;
        }
      }
    }

    console.log("Calculated streak:", currentStreak);
    return currentStreak;
  };

  // Calculate total problems and success rate
  const calculateStats = () => {
    if (!stats) {
      console.log("No stats available, returning default values");
      return {
        totalProblems: 0,
        successRate: 0,
        currentStreak: 0,
      };
    }

    console.log("Calculating stats with data:", stats);

    const totalProblems = stats.questionCount || 0;
    const solvedProblems =
      stats.successDistribution?.find((s) => s.success === 1)?.count || 0;
    const successRate =
      totalProblems > 0 ? (solvedProblems / totalProblems) * 100 : 0;
    const currentStreak = calculateCurrentStreak();

    const result = {
      totalProblems,
      successRate,
      currentStreak,
    };

    console.log("Calculated stats:", result);
    return result;
  };

  if (Object.keys(user).length === 0 || loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#121212",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Regular users see upgrade message instead of full dashboard
  if (user.role === "REGULAR") {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#121212",
        }}
      >
        <AuthenticatedNavbar />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            px: 4,
          }}
        >
          <Card
            sx={{
              maxWidth: 600,
              backgroundColor: grey[900],
              border: `1px solid ${grey[700]}`,
              borderRadius: 2,
              p: 3,
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{ color: grey[50], mb: 2, fontWeight: "bold" }}
              >
                🚀 Unlock Your Dashboard
              </Typography>
              <Typography variant="h6" sx={{ color: "#B9F2FF", mb: 3 }}>
                Premium Features Await!
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: grey[300], mb: 4, lineHeight: 1.6 }}
              >
                Access comprehensive analytics, detailed statistics, and
                advanced tracking features with our Premium or Premium Plus
                plans. Take your coding journey to the next level!
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/upgrade")}
                  sx={{
                    backgroundColor: "#B9F2FF",
                    color: "#121212",
                    fontWeight: "bold",
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "#A0E7FF",
                    },
                  }}
                >
                  Upgrade Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Footer />
      </Box>
    );
  }

  const { totalProblems, successRate, currentStreak } = calculateStats();

  // Premium and above users see the full dashboard
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#121212",
      }}
    >
      <AuthenticatedNavbar />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          px: { xs: 2, sm: 4, md: 6 },
          pt: 0,
          pb: 2,
        }}
      >
        <Box sx={{ mb: 6, maxWidth: "100%", mt: 2 }}>
          <Welcome
            user={user}
            stats={{
              currentStreak,
              totalProblems,
              successRate,
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <LeetCodeStats userId={user.id} stats={stats} />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
                width: "100%",
              }}
            >
              <DataStructureStats userId={user.id} />
              <AlgorithmStats />
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Dashboard;
