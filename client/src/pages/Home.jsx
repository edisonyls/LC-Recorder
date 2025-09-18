import React from "react";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "../components/navbar/HomeNavbar";
import { styled } from "@mui/material/styles";
import Footer from "../components/Footer";
import { Box, Typography, Container, Grid, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import {
  PrimaryButton,
  SecondaryButton,
} from "../components/generic/GenericButton";
import NotebookImage from "../images/NotebookImage.png";
import DashboardImage from "../images/dashboard.png";
import CodeDetailsImage from "../images/codeDetails.png";
import SpeedIcon from "@mui/icons-material/Speed";
import InsightsIcon from "@mui/icons-material/Insights";
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function Home() {
  const theme = useTheme();
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <HomeNavbar />

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center" minHeight="90vh">
            <Grid item xs={12} md={6}>
              <motion.div
                initial="initial"
                animate="animate"
                variants={stagger}
              >
                <motion.div variants={fadeInUp}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      letterSpacing: 2,
                      mb: 2,
                      display: "block",
                    }}
                  >
                    TRACK YOUR CODING JOURNEY
                  </Typography>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                      lineHeight: 1.1,
                      mb: 3,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    LC-Recorder
                  </Typography>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 400,
                      mb: 4,
                      lineHeight: 1.6,
                    }}
                  >
                    More than just a recorder. Track problems, analyze patterns,
                    and accelerate your coding interview preparation.
                  </Typography>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <PrimaryButton
                      onClick={() => navigate("/signin")}
                      size="large"
                      sx={{ px: 4, py: 1.5 }}
                    >
                      Get Started Free
                    </PrimaryButton>
                    <SecondaryButton
                      onClick={() => navigate("/signin")}
                      size="large"
                      sx={{ px: 4, py: 1.5 }}
                    >
                      Sign In
                    </SecondaryButton>
                  </Box>
                </motion.div>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <HeroImageBox>
                  <Box
                    component="img"
                    src={DashboardImage}
                    alt="Dashboard Preview"
                    sx={{
                      width: "100%",
                      height: "auto",
                      borderRadius: 2,
                      boxShadow: `0 20px 40px ${theme.palette.primary.main}20`,
                    }}
                  />
                  <FloatingElement
                    sx={{
                      top: -20,
                      right: -20,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    }}
                  >
                    <Box
                      component="img"
                      src="/logo-no-bg.png"
                      alt="LC-Recorder Logo"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: 1,
                      }}
                    />
                  </FloatingElement>
                </HeroImageBox>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <SectionHeader>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
                Everything You Need to Excel
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 600, mx: "auto" }}
              >
                Comprehensive tools designed specifically for serious coders
                preparing for technical interviews
              </Typography>
            </SectionHeader>
          </motion.div>

          <Grid container spacing={4} sx={{ mt: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <FeatureCard>
                    <FeatureIcon sx={{ background: feature.gradient }}>
                      {feature.icon}
                    </FeatureIcon>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        height: "3rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ flexGrow: 1 }}
                    >
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </FeaturesSection>

      {/* Features Showcase Section */}
      <FeaturesShowcaseSection>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <SectionHeader>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
                Explore Our Features
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Deep dive into what makes LC-Recorder special
              </Typography>
            </SectionHeader>
          </motion.div>

          <Box sx={{ mt: 8 }}>
            {featureShowcases.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <FeatureShowcaseItem
                  sx={{
                    flexDirection: {
                      xs: "column",
                      md: index % 2 === 0 ? "row" : "row-reverse",
                    },
                  }}
                >
                  <FeatureImageContainer>
                    <FeatureImage
                      component="img"
                      src={feature.image}
                      alt={feature.title}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 3,
                      }}
                    />
                    <FeatureImageOverlay />
                  </FeatureImageContainer>

                  <FeatureContent>
                    <FeatureNumber>
                      {String(index + 1).padStart(2, "0")}
                    </FeatureNumber>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        background: `linear-gradient(135deg, ${feature.gradient})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{ mb: 4, lineHeight: 1.7 }}
                    >
                      {feature.description}
                    </Typography>
                    <FeatureList>
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <FeatureListItem key={benefitIndex}>
                          <FeatureCheckIcon />
                          <Typography variant="body1" sx={{ ml: 2 }}>
                            {benefit}
                          </Typography>
                        </FeatureListItem>
                      ))}
                    </FeatureList>
                    <Box sx={{ mt: 4 }}>
                      <SecondaryButton
                        onClick={() => navigate("/signin")}
                        size="large"
                        sx={{ px: 4, py: 1.5 }}
                      >
                        Try {feature.title}
                      </SecondaryButton>
                    </Box>
                  </FeatureContent>
                </FeatureShowcaseItem>
              </motion.div>
            ))}
          </Box>
        </Container>
      </FeaturesShowcaseSection>

      {/* Call to Action Section */}
      <CallToActionSection>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box
              sx={{
                textAlign: "center",
                maxWidth: 800,
                mx: "auto",
                py: 8,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Ready to Start Your Coding Journey?
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.7 }}
              >
                Join thousands of developers who are already tracking their
                progress, organizing their knowledge, and accelerating their
                interview preparation with LC-Recorder.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <PrimaryButton
                  onClick={() => navigate("/signin")}
                  size="large"
                  sx={{ px: 6, py: 2, fontSize: "1.1rem" }}
                >
                  Get Started Now
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => navigate("/signin")}
                  size="large"
                  sx={{ px: 6, py: 2, fontSize: "1.1rem" }}
                >
                  Sign In
                </SecondaryButton>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 4,
                  opacity: 0.8,
                  fontStyle: "italic",
                }}
              >
                * Some advanced features require a premium upgrade. Start with
                our free tier to explore basic functionality.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </CallToActionSection>

      <Footer />
    </Box>
  );
}

const features = [
  {
    icon: <SpeedIcon sx={{ fontSize: 32 }} />,
    title: "Problem Tracking",
    description:
      "Record every LeetCode problem you solve with detailed information including time spent, attempts, and success status.",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    icon: <InsightsIcon sx={{ fontSize: 32 }} />,
    title: "Progress Analytics",
    description:
      "View comprehensive statistics and charts showing your solving patterns, difficulty distribution, and improvement over time.",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    icon: <GroupIcon sx={{ fontSize: 32 }} />,
    title: "Notebooks",
    description:
      "Take comprehensive notes on data structures and algorithms you've studied, with organized sections for concepts, implementations, and examples for easy reference.",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
];

const featureShowcases = [
  {
    title: "Dashboard Analytics",
    description:
      "Get comprehensive insights into your coding journey with detailed analytics and progress tracking.",
    image: DashboardImage,
    gradient: "#667eea 0%, #764ba2 100%",
    benefits: [
      "Visual progress charts and statistics",
      "Track your solving patterns over time",
      "Identify your strengths and weaknesses",
      "Monitor your improvement journey",
    ],
  },
  {
    title: "Problem Tracking",
    description:
      "Keep detailed records of every LeetCode problem you solve with comprehensive metadata and solutions.",
    image: CodeDetailsImage,
    gradient: "#f093fb 0%, #f5576c 100%",
    benefits: [
      "Record time spent on each problem",
      "Track multiple solution attempts",
      "Store your code solutions",
      "Monitor success rates and patterns",
    ],
  },
  {
    title: "Personal Notebooks",
    description:
      "Build your personal knowledge base by taking detailed notes on any topic you're learning, with easy access whenever you need to review.",
    image: NotebookImage,
    gradient: "#4facfe 0%, #00f2fe 100%",
    benefits: [
      "Create organized notes for each concept",
      "Add your own examples and implementations",
      "Quick access to your study materials",
      "Track your learning progress over time",
    ],
  },
];

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  background: theme.palette.background.default,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}15 0%, transparent 50%),
                 radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}15 0%, transparent 50%)`,
    pointerEvents: "none",
  },
}));

const HeroImageBox = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(2),
  "&::before": {
    content: '""',
    position: "absolute",
    inset: -2,
    borderRadius: theme.shape.borderRadius * 2,
    padding: 2,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}40, ${theme.palette.secondary.main}40)`,
    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    maskComposite: "exclude",
    WebkitMask:
      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
  },
}));

const FloatingElement = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: 80,
  height: 80,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#FFFFFF",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
  animation: "float 3s ease-in-out infinite",
}));

const FeaturesSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  background: theme.palette.background.paper,
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(6),
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  height: "400px",
  background: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 20px 40px ${theme.palette.primary.main}15`,
    borderColor: theme.palette.primary.main,
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 72,
  height: 72,
  borderRadius: theme.shape.borderRadius * 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: theme.spacing(3),
  color: "#FFFFFF",
}));

// New styled components for the features showcase
const FeaturesShowcaseSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(15, 0),
  background: theme.palette.background.paper,
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 30% 20%, ${theme.palette.primary.main}08 0%, transparent 50%),
                 radial-gradient(circle at 70% 80%, ${theme.palette.secondary.main}08 0%, transparent 50%)`,
    pointerEvents: "none",
  },
}));

const CallToActionSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 0),
  background: theme.palette.background.default,
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 20% 50%, ${theme.palette.primary.main}10 0%, transparent 50%),
                 radial-gradient(circle at 80% 50%, ${theme.palette.secondary.main}10 0%, transparent 50%)`,
    pointerEvents: "none",
  },
}));

const FeatureShowcaseItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(6),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(8),
  },
}));

const FeatureImageContainer = styled(Box)(({ theme }) => ({
  flex: "1",
  position: "relative",
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
  boxShadow: `0 20px 40px ${theme.palette.primary.main}15`,
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(4),
  },
}));

const FeatureImage = styled(Box)(({ theme }) => ({
  aspectRatio: "16/10",
  width: "100%",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const FeatureImageOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
  opacity: 0,
  transition: "opacity 0.3s ease",
  "&:hover": {
    opacity: 1,
  },
}));

const FeatureContent = styled(Box)(({ theme }) => ({
  flex: "1",
  position: "relative",
  [theme.breakpoints.down("md")]: {
    textAlign: "center",
  },
}));

const FeatureNumber = styled(Typography)(({ theme }) => ({
  position: "absolute",
  top: -20,
  left: -20,
  fontSize: "4rem",
  fontWeight: 900,
  color: theme.palette.primary.main,
  opacity: 0.1,
  lineHeight: 1,
  [theme.breakpoints.down("md")]: {
    position: "static",
    fontSize: "3rem",
    marginBottom: theme.spacing(2),
  },
}));

const FeatureList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const FeatureListItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.down("md")]: {
    justifyContent: "center",
  },
}));

const FeatureCheckIcon = styled(CheckCircleIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "1.5rem",
}));

export default Home;
