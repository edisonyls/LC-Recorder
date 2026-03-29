import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CodeIcon from "@mui/icons-material/Code";
import {
  Box,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const HomeNavbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };

  const list = () => (
    <Box
      sx={{
        width: 250,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 2,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <IconButton
          onClick={toggleDrawer(false)}
          sx={{ color: theme.palette.text.primary }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ flex: 1, pt: 3 }}>
        <ListItem
          component={Link}
          to="/signin"
          sx={{
            mb: 2,
            mx: 2,
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
          }}
        >
          <ListItemText
            primary="Sign In"
            sx={{
              "& .MuiListItemText-primary": {
                fontWeight: 500,
                fontSize: "1rem",
              },
            }}
          />
        </ListItem>
        <ListItem
          component={Link}
          to="/register"
          sx={{
            mx: 2,
            borderRadius: 1,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <ListItemText
            primary="Get Started"
            sx={{
              "& .MuiListItemText-primary": {
                fontWeight: 600,
                fontSize: "1rem",
                textAlign: "center",
              },
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "black",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            flexGrow: 1,
          }}
        >
          <Box
            component="img"
            src="/full-logo.png"
            alt="LC-Recorder"
            sx={{
              height: 50,
              width: "auto",
              cursor: "pointer",
            }}
          />
        </Box>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              sx={{
                "& .MuiDrawer-paper": {
                  backgroundColor: theme.palette.background.paper,
                  backgroundImage: "none",
                },
              }}
            >
              {list()}
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              component={Link}
              to="/signin"
              variant="text"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                },
              }}
            >
              Sign In
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: 600,
                px: 3,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                  transform: "translateY(-1px)",
                  boxShadow: `0 4px 12px rgba(0, 217, 255, 0.25)`,
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default HomeNavbar;
