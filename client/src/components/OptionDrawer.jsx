import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  Divider,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Storage as StorageIcon,
  Code as CodeIcon,
  Polyline as PolylineIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import UserBadge from "./UserBadge";
import { PrimaryButton } from "./generic/GenericButton";

const OptionDrawer = ({
  isOpen,
  toggleDrawer,
  handleLogout,
  currentPath,
  user,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const drawerOptions = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      onClick: () => navigate("/dashboard"),
      roles: ["PREMIUM", "PREPLUS", "ADMIN"],
    },
    {
      text: "LeetCode",
      icon: <CodeIcon />,
      path: "/table",
      onClick: () => navigate("/table"),
      roles: ["REGULAR", "PREMIUM", "PREPLUS", "ADMIN"],
    },
    {
      text: "Data Structure",
      icon: <StorageIcon />,
      path: "/data-structure",
      onClick: () => navigate("/data-structure"),
      roles: ["PREPLUS", "ADMIN"],
    },
    {
      text: "Algorithm",
      icon: <PolylineIcon />,
      path: "/algorithm",
      onClick: () => navigate("/algorithm"),
      roles: ["PREPLUS", "ADMIN"],
    },
    {
      text: "Profile",
      icon: <AccountCircleIcon />,
      path: "/profile",
      onClick: () => navigate("/profile"),
      roles: ["REGULAR", "PREMIUM", "PREPLUS", "ADMIN"],
    },
  ];

  // Filter options based on user role
  const filteredOptions = drawerOptions.filter((option) =>
    option.roles.includes(user?.role)
  );

  const handleClose = (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    toggleDrawer();
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 280,
          backgroundColor: theme.palette.background.paper,
          backgroundImage: "none",
        },
      }}
    >
      <Box
        sx={{
          width: 280,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        role="presentation"
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Menu
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* User Info */}
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              margin: "0 auto",
              mb: 2,
              backgroundColor: theme.palette.primary.main,
              fontSize: "2rem",
              fontWeight: 600,
            }}
          >
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            @{user?.username}
          </Typography>
          <UserBadge role={user?.role} />
        </Box>

        <Divider />

        {/* Navigation Options */}
        <List sx={{ flex: 1, px: 2, py: 1 }}>
          {filteredOptions.map((option) => (
            <ListItem
              key={option.text}
              onClick={option.onClick}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                cursor: "pointer",
                backgroundColor:
                  currentPath === option.path
                    ? theme.palette.action.selected
                    : "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    currentPath === option.path
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  minWidth: 40,
                }}
              >
                {option.icon}
              </ListItemIcon>
              <ListItemText
                primary={option.text}
                primaryTypographyProps={{
                  fontWeight: currentPath === option.path ? 600 : 400,
                  color:
                    currentPath === option.path
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* Upgrade Section for Free Users */}
        {user?.role === "REGULAR" && (
          <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Unlock Premium Features
            </Typography>
            <PrimaryButton
              fullWidth
              onClick={() => navigate("/upgrade")}
              sx={{ mb: 2 }}
            >
              Upgrade Now
            </PrimaryButton>
          </Box>
        )}

        {/* Logout */}
        <Box sx={{ p: 2 }}>
          <ListItem
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              cursor: "pointer",
              backgroundColor: theme.palette.error.main + "10",
              "&:hover": {
                backgroundColor: theme.palette.error.main + "20",
              },
            }}
          >
            <ListItemIcon
              sx={{ color: theme.palette.error.main, minWidth: 40 }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontWeight: 500,
                color: theme.palette.error.main,
              }}
            />
          </ListItem>
        </Box>
      </Box>
    </Drawer>
  );
};

export default OptionDrawer;
