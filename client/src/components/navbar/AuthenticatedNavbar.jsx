import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  useTheme,
  Avatar,
  Tooltip,
  Badge,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useUser } from "../../context/userContext";
import OptionDrawer from "../OptionDrawer";
import UserBadge from "../UserBadge";

const AuthenticatedNavbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { state, dispatch } = useUser();
  const { user } = state;
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "black",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          mb: 2,
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              cursor: "pointer",
            }}
            onClick={() => {
              if (location.pathname !== "/dashboard") {
                navigate("/dashboard");
              }
            }}
          >
            <Box
              component="img"
              src="/full-logo.png"
              alt="LC-Recorder"
              sx={{
                height: 45,
                width: "auto",
                cursor: "pointer",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <UserBadge role={user.role} />

            <Tooltip title="Notifications">
              <IconButton
                sx={{
                  color: theme.palette.text.primary,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                <Badge badgeContent={0} color="primary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Profile">
              <IconButton
                onClick={() => navigate("/profile")}
                sx={{
                  ml: 1,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  {user.username ? (
                    user.username.charAt(0).toUpperCase()
                  ) : (
                    <AccountCircleIcon />
                  )}
                </Avatar>
              </IconButton>
            </Tooltip>

            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{
                ml: 1,
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <OptionDrawer
        isOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        handleLogout={handleLogout}
        currentPath={location.pathname}
        user={user}
      />
    </>
  );
};

export default AuthenticatedNavbar;
