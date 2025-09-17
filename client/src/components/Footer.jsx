import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <GitHubIcon />,
      url: "https://github.com/edisonyls",
      label: "GitHub",
    },
    {
      icon: <LinkedInIcon />,
      url: "https://www.linkedin.com/in/edison-yang-152aa01b8/",
      label: "LinkedIn",
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        py: 3,
        mt: "auto",
        pt: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Brand Section */}
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 0.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              LC-Recorder
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              © {currentYear} LC-Recorder. All rights reserved.
            </Typography>
          </Box>

          {/* Links Section */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link
              href="/about"
              color="text.secondary"
              underline="hover"
              sx={{
                transition: "color 0.2s",
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              About
            </Link>
            <Link
              href="/privacy"
              color="text.secondary"
              underline="hover"
              sx={{
                transition: "color 0.2s",
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              color="text.secondary"
              underline="hover"
              sx={{
                transition: "color 0.2s",
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Terms
            </Link>
            <Link
              href="/contact"
              color="text.secondary"
              underline="hover"
              sx={{
                transition: "color 0.2s",
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              Contact
            </Link>
          </Box>

          {/* Social Links */}
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {socialLinks.map((social) => (
              <IconButton
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                size="small"
                sx={{
                  color: theme.palette.text.secondary,
                  transition: "all 0.2s",
                  "&:hover": {
                    color: theme.palette.primary.main,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
