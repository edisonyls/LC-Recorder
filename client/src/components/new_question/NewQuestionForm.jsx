import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  MenuItem,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SuccessToggle from "./SuccessToggle";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import TipTapSolution from "./TipTapSolution";
import NewQuestionFooter from "./NewQuestionFooter";
import { Star, StarBorder } from "@mui/icons-material";
import { toast } from "react-toastify";
import { GenericDialog } from "../generic/GenericDialog";
import { useQuestionHooks } from "../../hooks/useQuestionHooks";
import { getDefaultTipTapContent } from "../../utils/tipTapContentParser";

const NewQuestionForm = ({ timerValue }) => {
  const [question, setQuestion] = useState({
    number: "",
    title: "",
    difficulty: "",
    dateOfCompletion: null,
    success: null,
    attempts: "",
    timeOfCompletion: "",
    reasonOfFail: "",
    star: false,
    solutions: [
      {
        id: `solution_${Date.now()}_0`,
        content: JSON.stringify(getDefaultTipTapContent()),
        files: [],
        imageMap: new Map(),
      },
    ],
  });
  const [deleteSolutionPopUp, setDeleteSolutionPopUp] = useState(false);
  const [solutionDeleteId, setSolutionDeleteId] = useState(null);

  const { handleSubmit } = useQuestionHooks(question);

  const difficultyOptions = ["Easy", "Medium", "Hard"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "number" || name === "attempts") {
      const intValue = parseInt(value, 10);
      if (!isNaN(intValue) && value.match(/^\d*$/)) {
        setQuestion((prevState) => ({
          ...prevState,
          [name]: intValue,
        }));
      } else if (value === "") {
        // Allow clearing the field
        setQuestion((prevState) => ({
          ...prevState,
          [name]: "",
        }));
      }
      return;
    }
    setQuestion((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (name, value) => {
    setQuestion((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTimeChange = (prop, value) => {
    let numericValue = parseInt(value, 10);

    if (isNaN(numericValue)) {
      numericValue = 0;
    }

    if (prop === "minutes") {
      numericValue = Math.max(numericValue, 0);
    } else if (prop === "seconds") {
      numericValue = Math.max(0, Math.min(numericValue, 59));
    }

    const stringValue = numericValue.toString();

    setQuestion((prevQuestion) => {
      const timeParts = prevQuestion.timeOfCompletion.split(":");
      if (prop === "minutes") {
        timeParts[0] = stringValue;
      } else {
        timeParts[1] = stringValue.padStart(2, "0");
      }
      return {
        ...prevQuestion,
        timeOfCompletion: timeParts.join(":"),
      };
    });
  };

  const handleTipTapContentChange = (content, solutionId, imageInfo) => {
    setQuestion((prevQuestion) => {
      const updatedSolutions = prevQuestion.solutions.map((solution) => {
        if (solution.id === solutionId) {
          const updatedSolution = {
            ...solution,
            content: JSON.stringify(content),
          };

          if (imageInfo && imageInfo.file) {
            updatedSolution.files = updatedSolution.files || [];
            updatedSolution.imageMap = updatedSolution.imageMap || new Map();
            if (!updatedSolution.imageMap.has(imageInfo.blobUrl)) {
              updatedSolution.files.push(imageInfo.file);
              updatedSolution.imageMap.set(imageInfo.blobUrl, imageInfo.file);
            }
          }

          return updatedSolution;
        }
        return solution;
      });
      return { ...prevQuestion, solutions: updatedSolutions };
    });
  };

  const addSolution = () => {
    // Check if solution has TipTap content

    const newSolution = {
      id: `solution_${Date.now()}_${Math.random()}`,
      content: JSON.stringify(getDefaultTipTapContent()),
      files: [],
      imageMap: new Map(),
    };
    setQuestion((prevQuestions) => ({
      ...prevQuestions,
      solutions: [...prevQuestions.solutions, newSolution],
    }));
  };

  const handleDeleteSolution = () => {
    setQuestion((prevQuestions) => {
      // Filter out the solution with the given id
      const updatedSolutions = prevQuestions.solutions.filter(
        (solution) => solution.id !== solutionDeleteId
      );
      setSolutionDeleteId(null);
      setDeleteSolutionPopUp(false);
      return { ...prevQuestions, solutions: updatedSolutions };
    });
  };

  useEffect(() => {
    if (timerValue) {
      setQuestion((prevState) => ({
        ...prevState,
        timeOfCompletion: timerValue,
      }));
    }
  }, [timerValue]);

  return (
    <Container maxWidth="md" sx={{ marginBottom: 4 }}>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: -2,
            marginBottom: -2,
          }}
        >
          <IconButton
            onClick={() => {
              setQuestion((prev) => ({ ...prev, star: !prev.star }));
              if (question.star) {
                toast.info("Unmarked Important");
              } else {
                toast.info("Marked Important");
              }
            }}
          >
            {question.star ? (
              <Star sx={{ color: "#ffd250", fontSize: "2rem" }} />
            ) : (
              <StarBorder sx={{ fontSize: "2rem" }} />
            )}
          </IconButton>
        </Box>

        <Typography variant="h6" sx={{ marginTop: 2 }}>
          General Information
        </Typography>

        <TextField
          margin="normal"
          label="Question Number"
          name="number"
          fullWidth
          value={question.number}
          onChange={handleChange}
          required
        />
        <TextField
          margin="normal"
          fullWidth
          label="Title"
          name="title"
          value={question.title}
          onChange={handleChange}
          required
        />
        <TextField
          margin="normal"
          fullWidth
          select
          label="Difficulty"
          name="difficulty"
          value={question.difficulty}
          onChange={handleChange}
          required
        >
          {difficultyOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 2,
              marginBottom: 1,
              gap: 2,
            }}
          >
            <DatePicker
              label="Date of Completion *"
              format="DD-MM-YYYY"
              value={question.dateOfCompletion}
              maxDate={dayjs()}
              onChange={(newValue) =>
                handleDateChange("dateOfCompletion", newValue)
              }
              sx={{ minWidth: "auto", flexGrow: 3, margin: "auto" }}
            />
            <TextField
              label="Minutes Spent"
              name="minutes"
              value={question.timeOfCompletion.split(":")[0]}
              onChange={(e) => handleTimeChange("minutes", e.target.value)}
              sx={{ flexGrow: 1 }}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">minutes</InputAdornment>
                ),
              }}
            />

            <TextField
              label="Seconds Spent"
              name="seconds"
              value={question.timeOfCompletion.split(":")[1] || ""}
              onChange={(e) => handleTimeChange("seconds", e.target.value)}
              sx={{ flexGrow: 1 }}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">seconds</InputAdornment>
                ),
              }}
            />
          </Box>
        </LocalizationProvider>
        <TextField
          margin="normal"
          label="Number of Attempts"
          name="attempts"
          value={question.attempts}
          onChange={handleChange}
          sx={{ flexGrow: 1 }}
          required
          fullWidth
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 2,
          }}
        >
          <Typography sx={{ marginBottom: 1 }}>
            Did you solve this LeetCode problem? *
          </Typography>
          <SuccessToggle
            onChange={(success) =>
              setQuestion((prevState) => ({
                ...prevState,
                success: success,
              }))
            }
          />
        </Box>

        {question.success === false && (
          <Box>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Possible Obstacles
            </Typography>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Enter your possible obstacles"
                name="reasonOfFail"
                multiline
                value={question.reasonOfFail}
                onChange={handleChange}
                sx={{ marginBottom: 2 }}
              />
            </Box>
          </Box>
        )}

        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Solutions
        </Typography>
        <Box sx={{ mt: 2 }}>
          {question.solutions.map((solution, index) => (
            <TipTapSolution
              key={solution.id}
              solutionId={index + 1}
              deleteSolution={() => {
                setDeleteSolutionPopUp(true);
                setSolutionDeleteId(solution.id);
              }}
              showDeleteButton={question.solutions.length > 1}
              content={solution.content}
              onContentChange={(content, imageInfo) => {
                handleTipTapContentChange(content, solution.id, imageInfo);
              }}
            />
          ))}
        </Box>

        <NewQuestionFooter onClick={addSolution} />
      </form>
      <GenericDialog
        isOpen={deleteSolutionPopUp}
        onClose={() => {
          setDeleteSolutionPopUp(false);
          setSolutionDeleteId(null);
        }}
        onConfirm={handleDeleteSolution}
        title={`Deleting Solution ${
          solutionDeleteId !== null
            ? question.solutions.findIndex((s) => s.id === solutionDeleteId) + 1
            : ""
        }`}
        content="Do you want to delete this solution?"
      />
    </Container>
  );
};

export default NewQuestionForm;
