import { grey } from "@mui/material/colors";
import React, { useState } from "react";
import AuthenticatedNavbar from "../components/navbar/AuthenticatedNavbar";
import { 
  Box, 
  Typography, 
  Switch, 
  Grid, 
  Paper, 
  Chip, 
  Container,
  Dialog,
  DialogContent,
  TextField,
  Button,
  IconButton,
  InputAdornment
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Footer from "../components/Footer";
import { GreyBackgroundButton } from "../components/generic/GenericButton";
import { useUser } from "../context/userContext";
import { axiosInstance } from "../config/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UpgradePage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pkgName, setPkgName] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { state } = useUser();
  const { user } = state;
  const navigate = useNavigate();

  const packages = [
    {
      name: "Basic",
      title: "Free Tier",
      monthlyPrice: "Free",
      yearlyPrice: "Free",
      description: "Perfect for getting started",
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: "#4CAF50" }} />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderColor: "#667eea",
      feature: [
        { text: "Record coding problems", isExtra: false },
        { text: "Details of each problem", isExtra: false },
        { text: "Image Uploading", isExtra: false },
      ],
      available: false,
      popular: false,
    },
    {
      name: "Premium",
      title: "Premium Tier",
      monthlyPrice: "$4.99",
      yearlyPrice: "$39.99",
      description: "Unlock powerful analytics",
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#FF6B6B" }} />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderColor: "#FF6B6B",
      feature: [
        { text: "Everything in Free Tier plus:", isExtra: false, isHeader: true },
        { text: "Statistics Analysis", isExtra: true },
        { text: "Dashboard Access", isExtra: true },
      ],
      available: user.role !== "PREMIUM" && user.role !== "PREPLUS",
      popular: true,
    },
    {
      name: "Premium-Plus",
      title: "Premium Plus Tier",
      monthlyPrice: "$9.99",
      yearlyPrice: "$69.99",
      description: "Complete coding mastery suite",
      icon: <EmojiEventsIcon sx={{ fontSize: 40, color: "#FFD700" }} />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      borderColor: "#FFD700",
      feature: [
        { text: "Everything in Premium Tier plus:", isExtra: false, isHeader: true },
        { text: "Data Structure Recording", isExtra: true },
        { text: "Algorithm Recording", isExtra: true },
        { text: "Advanced Analytics", isExtra: true },
      ],
      available: user.role !== "PREPLUS",
      popular: false,
    },
  ];

  const handleConfirm = async (enteredKey) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        `/payment/verify?secretKey=${encodeURIComponent(enteredKey)}`
      );

      if (response.data.serverMessage === "SUCCESS") {
        handleUpgrade();
        setDialogOpen(false);
        setSecretKey("");
        toast.success("Secret key verified! Processing upgrade...");
      } else {
        toast.error("Wrong secret key! Contact admin.");
      }
    } catch (error) {
      toast.error("Something went wrong while verifying.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSecretKey("");
    setShowPassword(false);
  };

  const handleSecretKeySubmit = () => {
    if (secretKey.trim()) {
      handleConfirm(secretKey);
    } else {
      toast.error("Please enter a secret key");
    }
  };

  const handleUpgrade = async () => {
    const currentRole = user?.role;
    var newRole = pkgName.toUpperCase();
    if (newRole === "PREMIUM-PLUS") {
      newRole = "PREPLUS";
    }

    if (currentRole === newRole) {
      console.log("User is already in the selected role.");
      return;
    }

    try {
      const response = await axiosInstance.get("user/payment", {
        params: {
          currentRole: currentRole,
          upgradeRole: newRole,
        },
      });

      if (response.data.status === 200) {
        toast.success("Upgrade successfully!");
        navigate("/profile");
      } else {
        console.log("Upgrade failed:", response.data);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Upgrade failed:", error);
    }
  };

  const handleDialogOpen = (name) => {
    setDialogOpen(true);
    setPkgName(name);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%)",
      }}
    >
      <AuthenticatedNavbar />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          mt: -4,
          px: { xs: 1, sm: 2, md: 6 },
          position: "relative",
          overflow: "hidden",
          maxHeight: "100vh",
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: "absolute",
            top: "5%",
            right: "5%",
            width: 100,
            height: 100,
            background: "radial-gradient(circle, rgba(185,242,255,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-10px)" },
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            left: "3%",
            width: 80,
            height: 80,
            background: "radial-gradient(circle, rgba(255,107,107,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />

        {/* Hero Section */}
        <Box sx={{ py: { xs: 2, md: 3 }, textAlign: "center", position: "relative", zIndex: 1 }}>
          <Box sx={{ mb: 1 }}>
            <RocketLaunchIcon 
              sx={{ 
                fontSize: 40, 
                color: "#B9F2FF", 
                mb: 1,
                animation: "pulse 2s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { transform: "scale(1)" },
                  "50%": { transform: "scale(1.1)" },
                },
              }} 
            />
          </Box>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 1, 
              color: grey[50],
              fontWeight: "bold",
              background: "linear-gradient(45deg, #B9F2FF 30%, #ffffff 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "1.8rem", md: "2.5rem" }
            }}
          >
            Supercharge Your Coding Journey
          </Typography>
          <Typography
            variant="body1"
            sx={{
              px: { xs: 2, md: 4 },
              color: grey[300],
              maxWidth: "500px",
              mx: "auto",
              fontSize: { xs: "0.9rem", md: "1rem" },
              lineHeight: 1.4,
              mb: 2,
            }}
          >
            Unlock premium features with advanced analytics and exclusive tools for serious developers.
          </Typography>

          {/* Billing Toggle */}
          <Box
            sx={{
              mt: 2,
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: 3,
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              maxWidth: 250,
              mx: "auto",
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                mr: 1, 
                color: isYearly ? grey[400] : "#B9F2FF",
                fontWeight: isYearly ? "normal" : "bold",
                transition: "all 0.3s ease",
                fontSize: "0.9rem"
              }}
            >
              Monthly
            </Typography>
            <Switch
              checked={isYearly}
              onChange={() => setIsYearly(!isYearly)}
              size="small"
              sx={{
                mr: 1,
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#B9F2FF",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#B9F2FF",
                },
              }}
            />
            <Typography 
              variant="body1" 
              sx={{ 
                color: isYearly ? "#B9F2FF" : grey[400],
                fontWeight: isYearly ? "bold" : "normal",
                transition: "all 0.3s ease",
                fontSize: "0.9rem"
              }}
            >
              Yearly
            </Typography>
            {isYearly && (
              <Chip
                label="Save 33%"
                size="small"
                sx={{
                  ml: 1,
                  background: "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.7rem",
                  height: 20,
                }}
              />
            )}
          </Box>

          {/* Pricing Cards */}
          <Container maxWidth="lg">
            <Grid container spacing={2} sx={{ mt: 1, justifyContent: "center" }}>
              {packages.map((pkg, i) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={i}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Paper
                    elevation={pkg.popular ? 20 : 8}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: pkg.popular 
                        ? "linear-gradient(135deg, rgba(185,242,255,0.1) 0%, rgba(255,107,107,0.1) 100%)"
                        : "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(20px)",
                      border: `2px solid ${pkg.popular ? pkg.borderColor : "rgba(255, 255, 255, 0.1)"}`,
                      color: grey[50],
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      position: "relative",
                      transition: "all 0.3s ease",
                      transform: pkg.popular ? "scale(1.02)" : "scale(1)",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: `0 10px 20px rgba(${pkg.popular ? "185,242,255" : "255,255,255"}, 0.2)`,
                      },
                    }}
                  >
                    {pkg.popular && (
                      <Chip
                        label="🔥 POPULAR"
                        sx={{
                          position: "absolute",
                          top: -8,
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "linear-gradient(45deg, #FF6B6B 30%, #FF8E8E 90%)",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                          height: 20,
                        }}
                      />
                    )}

                    <Box sx={{ mb: 1, mt: pkg.popular ? 1 : 0, minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {React.cloneElement(pkg.icon, { sx: { fontSize: 30, color: pkg.icon.props.sx.color } })}
                    </Box>

                    <Box sx={{ minHeight: 60, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 0.5,
                          fontWeight: "bold",
                          background: pkg.popular 
                            ? "linear-gradient(45deg, #B9F2FF 30%, #FF6B6B 90%)"
                            : "linear-gradient(45deg, #B9F2FF 30%, #ffffff 90%)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontSize: "1.1rem"
                        }}
                      >
                        {pkg.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ color: grey[400], fontSize: "0.8rem" }}
                      >
                        {pkg.description}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2, minHeight: 60, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <Typography
                        variant="h5"
                        sx={{ 
                          color: pkg.popular ? "#FF6B6B" : "#B9F2FF", 
                          fontWeight: "bold",
                          mb: 0.5 
                        }}
                      >
                        {isYearly ? pkg.yearlyPrice : pkg.monthlyPrice}
                      </Typography>
                      {pkg.monthlyPrice !== "Free" && (
                        <Typography
                          variant="body2"
                          sx={{ color: grey[400], fontSize: "0.75rem" }}
                        >
                          per {isYearly ? "year" : "month"}
                        </Typography>
                      )}
                    </Box>

                    <Box
                      sx={{
                        mb: 2,
                        textAlign: "left",
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        minHeight: 120,
                      }}
                    >
                      <ul
                        style={{
                          listStyleType: "none",
                          paddingLeft: 0,
                          margin: 0,
                        }}
                      >
                        {pkg.feature.slice(0, 5).map((feat, idx) => (
                          <li
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "6px",
                              padding: feat.isHeader ? "6px 6px" : "4px 6px",
                              borderRadius: "6px",
                              background: feat.isHeader 
                                ? "rgba(185, 242, 255, 0.15)" 
                                : feat.isExtra 
                                  ? "rgba(185, 242, 255, 0.1)" 
                                  : "rgba(255, 255, 255, 0.05)",
                            }}
                          >
                            {feat.isHeader ? (
                              <Typography variant="body2" sx={{ 
                                fontSize: "0.75rem", 
                                fontWeight: "bold",
                                color: "#B9F2FF",
                                width: "100%",
                                textAlign: "center"
                              }}>
                                {feat.text}
                              </Typography>
                            ) : (
                              <>
                                {feat.isExtra ? (
                                  <StarIcon sx={{ mr: 1, color: "#FFD700", fontSize: 14 }} />
                                ) : (
                                  <CheckCircleIcon sx={{ mr: 1, color: "#4CAF50", fontSize: 14 }} />
                                )}
                                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                                  {feat.text}
                                </Typography>
                              </>
                            )}
                          </li>
                        ))}
                        {pkg.feature.length > 5 && (
                          <li style={{ textAlign: "center", padding: "4px" }}>
                            <Typography variant="body2" sx={{ color: grey[400], fontSize: "0.7rem" }}>
                              +{pkg.feature.length - 5} more features
                            </Typography>
                          </li>
                        )}
                      </ul>
                    </Box>

                    <Box sx={{ mt: "auto", minHeight: 50, display: "flex", alignItems: "end" }}>
                      <GreyBackgroundButton
                        buttonText={pkg.available ? "Upgrade Now" : "Current Plan"}
                        onClick={() => handleDialogOpen(pkg.name)}
                        disabled={pkg.available !== true}
                        sx={{
                          width: "100%",
                          py: 1,
                          fontSize: "0.8rem",
                          background: pkg.available 
                            ? "#ffffff"
                            : "rgba(255, 255, 255, 0.1)",
                          color: pkg.available ? "#000000" : grey[400],
                          border: pkg.available ? "1px solid #ffffff" : "1px solid rgba(255, 255, 255, 0.2)",
                          fontWeight: pkg.available ? "bold" : "normal",
                          "&:hover": {
                            background: pkg.available 
                              ? "#f5f5f5"
                              : "rgba(255, 255, 255, 0.1)",
                            color: pkg.available ? "#000000" : grey[400],
                          },
                        }}
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
      {/* Modern Secret Key Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(135deg, rgba(18,18,18,0.95) 0%, rgba(30,30,30,0.95) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(185, 242, 255, 0.2)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(5px)",
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 4, textAlign: "center", position: "relative" }}>
            {/* Close Button - Top Right */}
            <IconButton 
              onClick={handleDialogClose}
              sx={{ 
                position: "absolute",
                top: 16,
                right: 16,
                color: grey[400],
                "&:hover": { 
                  color: grey[50],
                  backgroundColor: "rgba(255, 255, 255, 0.1)" 
                }
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Header - Centered */}
            <Box sx={{ mb: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box sx={{ 
                display: "flex", 
                alignItems: "center",
                justifyContent: "center",
                p: 2, 
                borderRadius: "50%", 
                background: "linear-gradient(45deg, #B9F2FF 30%, #87CEEB 90%)",
                mb: 2,
                width: 64,
                height: 64
              }}>
                <LockIcon sx={{ fontSize: 32, color: "#000" }} />
              </Box>
              
              <Typography variant="h5" sx={{ 
                color: grey[50], 
                fontWeight: "bold",
                mb: 1,
                background: "linear-gradient(45deg, #B9F2FF 30%, #ffffff 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center"
              }}>
                Enter Secret Key
              </Typography>
              
              <Typography variant="body2" sx={{ 
                color: grey[400], 
                textAlign: "center",
                maxWidth: "80%"
              }}>
                Please enter your secret key to upgrade to <strong>{pkgName}</strong> tier
              </Typography>
            </Box>

            {/* Input Field - Centered */}
            <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
              <TextField
                fullWidth
                label="Secret Key"
                type={showPassword ? "text" : "password"}
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSecretKeySubmit();
                  }
                }}
                variant="outlined"
                placeholder="Enter your secret key..."
                sx={{
                  maxWidth: 400,
                  "& .MuiInputLabel-root": { 
                    color: grey[400],
                    "&.Mui-focused": { color: "#B9F2FF" }
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: 2,
                    "& fieldset": { 
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      borderWidth: 2
                    },
                    "&:hover fieldset": { 
                      borderColor: "rgba(185, 242, 255, 0.5)" 
                    },
                    "&.Mui-focused fieldset": { 
                      borderColor: "#B9F2FF",
                      borderWidth: 2
                    },
                    color: grey[50],
                    fontSize: "1.1rem",
                    "& input": {
                      padding: "16px 14px",
                      textAlign: "center"
                    }
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: grey[400] }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: grey[400] }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Action Buttons - Centered */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 3 }}>
              <Button
                variant="outlined"
                onClick={handleDialogClose}
                disabled={isLoading}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  color: grey[400],
                  borderRadius: 2,
                  minWidth: 120,
                  "&:hover": {
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSecretKeySubmit}
                disabled={isLoading || !secretKey.trim()}
                sx={{
                  px: 4,
                  py: 1.5,
                  background: isLoading 
                    ? "rgba(185, 242, 255, 0.5)"
                    : "linear-gradient(45deg, #B9F2FF 30%, #87CEEB 90%)",
                  color: "#000",
                  fontWeight: "bold",
                  borderRadius: 2,
                  minWidth: 150,
                  "&:hover": {
                    background: isLoading 
                      ? "rgba(185, 242, 255, 0.5)"
                      : "linear-gradient(45deg, #87CEEB 30%, #B9F2FF 90%)",
                  },
                  "&:disabled": {
                    background: "rgba(185, 242, 255, 0.3)",
                    color: "rgba(0, 0, 0, 0.5)",
                  }
                }}
              >
                {isLoading ? "Verifying..." : "Confirm Upgrade"}
              </Button>
            </Box>

            {/* Helper Text - Centered */}
            <Typography variant="caption" sx={{ 
              color: grey[500], 
              display: "block",
              fontStyle: "italic",
              textAlign: "center"
            }}>
              💡 Contact support if you need help with your secret key
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
      <Footer />
    </Box>
  );
};

export default UpgradePage;
