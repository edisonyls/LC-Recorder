import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import AuthenticatedNavbar from "../components/navbar/AuthenticatedNavbar";
import Footer from "../components/Footer";
import { BlackBackgroundButton } from "../components/generic/GenericButton";
import { Link } from "react-router-dom";
import { UserHooks } from "../hooks/userHooks/UserHooks";

const NotFoundPage = () => {
  const { getCurrentUser } = UserHooks();

  useEffect(() => {
    getCurrentUser();
  }, []); // eslint-disable-line

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
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
          mt: -4,
        }}
      >
        <Typography variant="h2" sx={{ color: "white", mt: 4, mb: 4 }}>
          Page Not Found!
        </Typography>
        <BlackBackgroundButton component={Link} to="/table" buttonText="Back" />
      </Box>
      <Footer />
    </Box>
  );
};

export default NotFoundPage;
