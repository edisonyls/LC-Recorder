import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";

const AccountNavbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }}>
      <Toolbar>
        <Box
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Box
            component="img"
            src="/full-logo.png"
            alt="LC-Recorder"
            sx={{
              height: 45,
              width: "auto",
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AccountNavbar;
