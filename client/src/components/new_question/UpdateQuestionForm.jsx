import React, { useState } from "react";
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
import {
  getDefaultTipTapContent,
  parseTipTapContent,
} from "../../utils/tipTapContentParser";

const UpdateQuestionForm = ({ initialQuestion }) => {
  const [question, setQuestion] = useState(() => {
    if (!initialQuestion) return {};

    // Handle solutions: ensure they have proper structure
    let solutions = [];
    if (initialQuestion.solutions && initialQuestion.solutions.length > 0) {
      solutions = initialQuestion.solutions.map((solution, index) => {
        const parsedContent = parseTipTapContent(solution);
        return {
          id: `solution_${Date.now()}_${index}`,
          content: parsedContent
            ? JSON.stringify(parsedContent)
            : JSON.stringify(getDefaultTipTapContent()),
        };
      });
    } else {
      // If no solutions exist, create a default one
      solutions = [
        {
          id: `solution_${Date.now()}_0`,
          content: JSON.stringify(getDefaultTipTapContent()),
        },
      ];
    }

    return {
      ...initialQuestion,
      solutions,
      dateOfCompletion: initialQuestion.dateOfCompletion
        ? dayjs(initialQuestion.dateOfCompletion)
        : null,
    };
  });

  const [deleteSolutionPopUp, setDeleteSolutionPopUp] = useState(false);
  const [solutionDeleteId, setSolutionDeleteId] = useState(null);

  const { handleUpdateSubmit } = useQuestionHooks(question, initialQuestion);

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
      [name]: dayjs(value).format(),
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

  const handleTipTapContentChange = (content, solutionId) => {
    setQuestion((prevQuestion) => {
      const updatedSolutions = prevQuestion.solutions.map((solution) => {
        if (solution.id === solutionId) {
          return { ...solution, content: JSON.stringify(content) };
        }
        return solution;
      });
      return { ...prevQuestion, solutions: updatedSolutions };
    });
  };

  const addSolution = () => {
    const newSolution = {
      id: `solution_${Date.now()}_${Math.random()}`,
      content: JSON.stringify(getDefaultTipTapContent()),
    };
    setQuestion((prevQuestions) => ({
      ...prevQuestions,
      solutions: [...(prevQuestions.solutions || []), newSolution],
    }));
  };

  const handleDeleteSolution = () => {
    if (solutionDeleteId !== null) {
      setQuestion((prevQuestions) => {
        // Filter out the solution with the given id
        const updatedSolutions = (prevQuestions.solutions || []).filter(
          (solution) => {
            const shouldKeep = solution.id !== solutionDeleteId;
            return shouldKeep;
          }
        );

        return { ...prevQuestions, solutions: updatedSolutions };
      });

      setSolutionDeleteId(null);
      setDeleteSolutionPopUp(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginBottom: 4 }}>
      <form onSubmit={handleUpdateSubmit}>
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          General Information
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TextField
            margin="normal"
            label="Question Number"
            name="number"
            fullWidth
            value={question.number}
            onChange={handleChange}
            required
          />
          <IconButton
            onClick={() => {
              setQuestion((prev) => ({ ...prev, star: !prev.star }));
              if (question.star) {
                toast.info("Unmarked Important");
              } else {
                toast.info("Marked Important");
              }
            }}
            sx={{ marginRight: "10%", marginLeft: "10%" }}
          >
            {question.star ? (
              <Star sx={{ color: "#ffd250", fontSize: "2rem" }} />
            ) : (
              <StarBorder sx={{ fontSize: "2rem" }} />
            )}
          </IconButton>
        </Box>
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
            success={question.success}
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
          {question.solutions && question.solutions.length > 0 ? (
            question.solutions.map((solution, index) => (
              <TipTapSolution
                key={solution.id}
                solutionId={index + 1}
                deleteSolution={() => {
                  setDeleteSolutionPopUp(true);
                  setSolutionDeleteId(solution.id);
                }}
                showDeleteButton={question.solutions.length > 1}
                content={solution.content}
                onContentChange={(content) =>
                  handleTipTapContentChange(content, solution.id)
                }
              />
            ))
          ) : (
            <TipTapSolution
              key="default-solution"
              solutionId={1}
              deleteSolution={() => {}}
              showDeleteButton={false}
              content={JSON.stringify(getDefaultTipTapContent())}
              onContentChange={(content) =>
                handleTipTapContentChange(content, "default-solution")
              }
            />
          )}
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

export default UpdateQuestionForm;
