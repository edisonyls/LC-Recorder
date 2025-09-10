import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../config/axiosConfig";
import AuthenticatedNavbar from "../components/navbar/AuthenticatedNavbar";

import TipTapViewer from "../components/TipTapViewer";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  CardHeader,
  Avatar,
  Box,
  Paper,
  Stack,
} from "@mui/material";
import {
  Assignment,
  CheckCircle,
  Error,
  Timer,
  QueryStats,
  ArrowBack,
  Terrain,
  Code,
} from "@mui/icons-material";
import SyncIcon from "@mui/icons-material/Sync";
import { WhiteBackgroundButton } from "../components/generic/GenericButton";
import GenericSpinner from "../components/generic/GenericSpinner";
import Footer from "../components/Footer";
import RandomQuote from "../components/RandomQuote";

const QuestionDetails = () => {
  const [question, setQuestion] = useState();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await axiosInstance
        .get("question/" + id)
        .then((response) => {
          setQuestion(response.data.data);
        })
        .catch((error) => {
          console.error("Failed to fetch data: ", error);
        });
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleUpdate = () => {
    navigate("/new", { state: { question: question } });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "#4CAF50";
      case "Medium":
        return "#FF9800";
      case "Hard":
        return "#F44336";
      default:
        return "#6B7280";
    }
  };

  if (!question || loading) {
    return (
      <>
        <AuthenticatedNavbar />
        <GenericSpinner />
      </>
    );
  }

  return (
    <>
      <AuthenticatedNavbar />
      <Container maxWidth="lg" sx={{ py: 4, minHeight: "81vh" }}>
        {/* Navigation Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <WhiteBackgroundButton
            icon={<ArrowBack />}
            onClick={() => navigate(-1)}
            buttonText="Back"
          />
          <WhiteBackgroundButton
            icon={<SyncIcon />}
            onClick={handleUpdate}
            buttonText="Modify"
          />
        </Box>

        {/* Main Question Card */}
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "primary.main", color: "black" }}>
                <Assignment />
              </Avatar>
            }
            title={
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                {question.number}. {question.title}
              </Typography>
            }
            subheader={
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Completed on {question.dateOfCompletion}
              </Typography>
            }
            action={
              <Chip
                label={question.success ? " Solved" : " Not Quite"}
                color={question.success ? "success" : "error"}
                icon={question.success ? <CheckCircle /> : <Error />}
                variant={question.success ? "filled" : "outlined"}
                size="large"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  px: 2,
                  py: 0.5,
                  borderWidth: 2,
                  backgroundColor: question.success ? "#059669" : "transparent",
                  borderColor: question.success ? "#059669" : "#DC2626",
                  color: question.success ? "white" : "#DC2626",
                  "&:hover": {
                    backgroundColor: question.success
                      ? "#047857"
                      : "rgba(220, 38, 38, 0.1)",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.3s ease",
                  boxShadow: question.success
                    ? "0 4px 12px rgba(5, 150, 105, 0.3)"
                    : "0 4px 12px rgba(220, 38, 38, 0.2)",
                }}
              />
            }
            sx={{ pb: 2 }}
          />

          <CardContent sx={{ pt: 0 }}>
            {/* Question Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    backgroundColor: "background.elevated",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <QueryStats
                    sx={{ fontSize: 32, mb: 1, color: "primary.main" }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Difficulty
                  </Typography>
                  <Chip
                    label={question.difficulty}
                    sx={{
                      backgroundColor: getDifficultyColor(question.difficulty),
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    backgroundColor: "background.elevated",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Timer sx={{ fontSize: 32, mb: 1, color: "primary.main" }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Time Taken
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {question.timeOfCompletion}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    backgroundColor: "background.elevated",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Assignment
                    sx={{ fontSize: 32, mb: 1, color: "primary.main" }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Attempts
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {question.attempts}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    backgroundColor: "background.elevated",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Code sx={{ fontSize: 32, mb: 1, color: "primary.main" }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Solutions
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {question.solutions?.length || 0}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Obstacles Section */}
            {question.reasonOfFail && question.reasonOfFail.trim() !== "" && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  backgroundColor: "background.elevated",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Terrain sx={{ mr: 2, color: "warning.main" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Obstacles Encountered
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                    pl: 2,
                    borderLeft: "3px solid",
                    borderColor: "warning.main",
                  }}
                >
                  {question.reasonOfFail}
                </Typography>
              </Paper>
            )}
          </CardContent>
        </Card>

        {/* Solutions Section */}
        {question.solutions && question.solutions.length > 0 && (
          <Box>
            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: 600, color: "text.primary" }}
            >
              {question.solutions.length} Solution(s)
            </Typography>

            <Stack spacing={4}>
              {question.solutions.map((solution, index) => (
                <Card key={index} elevation={2}>
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{ bgcolor: "secondary.main", color: "white" }}
                      >
                        {index + 1}
                      </Avatar>
                    }
                    title={
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Solution {index + 1}
                      </Typography>
                    }
                  />

                  <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ "& > div": { mb: 0 } }}>
                      <TipTapViewer
                        content={solution}
                        questionId={question.id}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}
      </Container>

      <Box sx={{ mt: 6 }}>
        <RandomQuote />
      </Box>
      <Footer />
    </>
  );
};

export default QuestionDetails;
