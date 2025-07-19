import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import React, { useEffect } from "react";
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

const Dashboard = () => {
  const { state } = useUser();
  const { user, token } = state;
  const { getCurrentUser } = UserHooks();
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser(token);
  }, []); // eslint-disable-line

  if (Object.keys(user).length === 0) {
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
        }}
      >
        <AuthenticatedNavbar />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#121212",
            mt: -4,
            mb: 4,
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

  // Premium and above users see the full dashboard
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <AuthenticatedNavbar />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#121212",
          mt: -4,
        }}
      >
        <Box sx={{ mb: 6 }}>
          <Welcome user={user} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginLeft: "5%",
              marginRight: "5%",
              width: "90%",
            }}
          >
            <LeetCodeStats userId={user.id} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
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
