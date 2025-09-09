import React, { useState } from "react";
import AuthenticatedNavbar from "../components/navbar/AuthenticatedNavbar";
import NewQuestionForm from "../components/new_question/NewQuestionForm";
import { Box, Typography } from "@mui/material";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { WhiteBackgroundButton } from "../components/generic/GenericButton";
import Stopwatch from "../components/Stopwatch";
import { GenericDialog } from "../components/generic/GenericDialog";
import { ArrowBack } from "@mui/icons-material";
import UpdateQuestionForm from "../components/new_question/UpdateQuestionForm";

const NewQuestion = () => {
  const [timeOfCompletion, setTimeOfCompletion] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const location = useLocation();
  const withTimer = location.state?.withTimer || false;
  const question = location.state?.question || null;
  const navigate = useNavigate();

  const handleTimeSubmit = (time) => {
    setTimeOfCompletion(time);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <AuthenticatedNavbar />

      {/* Header with Back button and Title */}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        <WhiteBackgroundButton
          icon={<ArrowBack />}
          onClick={() => setDialogOpen(true)}
          buttonText="Back"
        />
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          {question === null ? "Upload New Question" : "Modify Question"}
        </Typography>
        <Box sx={{ width: "80px" }} /> {/* Spacer for balance */}
      </Box>

      {/* Stopwatch - Prominently displayed at the top */}
      {withTimer && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingX: 2,
            marginBottom: 2,
          }}
        >
          <Stopwatch onTimeSubmit={handleTimeSubmit} />
        </Box>
      )}

      <Box sx={{ mb: 4 }}>
        {question === null ? (
          <NewQuestionForm timerValue={timeOfCompletion} />
        ) : (
          <UpdateQuestionForm initialQuestion={question} />
        )}
      </Box>

      <Footer />
      <GenericDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={() => navigate(-1)}
        title={question === null ? "Return to Dashboard" : "Return to Question"}
        content="Are you sure? All unsaved data will be lost."
      />
    </Box>
  );
};

export default NewQuestion;
