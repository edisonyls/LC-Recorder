import React, { useState } from "react";
import {
  Typography,
  TextField,
  Box,
  InputAdornment,
  IconButton,
  Paper,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  WarningButton,
  WhiteBackgroundButton,
  WhiteBackgroundButtonWithInput,
} from "../generic/GenericButton";

const Solution = ({
  solutionId,
  deleteSolution,
  thinkingProcess,
  handleChange,
  codeSnippet,
  deleteCodeSnippet,
  imagePreviewUrl,
  handleFileChange,
  handleDeleteImage,
  showDeleteButton,
}) => {
  const [showCodeInput, setShowCodeInput] = useState(codeSnippet !== "");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    deleteSolution();
    handleMenuClose();
  };

  const handleOnClick = () => {
    deleteCodeSnippet();
    setShowCodeInput(false);
  };

  const handleTabInTextField = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const cursorPosition = event.target.selectionStart;
      const beforeTab = thinkingProcess.substring(0, cursorPosition);
      const afterTab = thinkingProcess.substring(cursorPosition);
      const updatedText = beforeTab + "        " + afterTab;
      handleChange({ target: { name: event.target.name, value: updatedText } });
      setTimeout(() => {
        event.target.selectionStart = event.target.selectionEnd =
          cursorPosition + 8;
      }, 0); // Set cursor position right after the inserted tab
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 2,
          marginBottom: 1,
        }}
      >
        <Box sx={{ flex: 1 }} />
        <Typography variant="h6">Solution {solutionId}</Typography>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {showDeleteButton && (
            <>
              <IconButton 
                onClick={handleMenuClick}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    color: 'text.primary',
                  }
                }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem 
                  onClick={handleDeleteClick}
                  sx={{
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.light',
                      color: 'error.dark',
                    }
                  }}
                >
                  <DeleteForeverIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                  Delete Solution
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{ marginBottom: "1rem", marginLeft: "1rem" }}
      >
        Thinking Process
      </Typography>
      <TextField
        fullWidth
        label="Enter your thinking process"
        name="thinkingProcess"
        multiline
        value={thinkingProcess}
        onChange={handleChange}
        onKeyDown={handleTabInTextField}
        sx={{ marginBottom: 2 }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: showCodeInput || imagePreviewUrl ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {showCodeInput ? (
          <Box
            sx={{
              alignItems: "flex-start",
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography
              variant="body2"
              sx={{ marginBottom: "1rem", marginLeft: "1rem" }}
            >
              Code Snippet
            </Typography>
            <TextField
              fullWidth
              label="Paste your code snippet here"
              name="codeSnippet"
              multiline
              value={codeSnippet}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleOnClick} 
                      edge="end"
                      size="small"
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                          color: 'error.main',
                        }
                      }}
                    >
                      <DeleteForeverIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        ) : (
          <WhiteBackgroundButton
            buttonText="Upload Code"
            onClick={() => {
              setShowCodeInput(true);
            }}
          />
        )}

        {imagePreviewUrl ? (
          <Paper
            elevation={0}
            sx={{ width: "96%", padding: 2, marginTop: "-1rem" }}
          >
            <Typography variant="body2" sx={{ marginBottom: "8px" }}>
              Image Preview:
            </Typography>
            <img
              src={imagePreviewUrl}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "contain",
                marginBottom: "1rem",
              }}
            />
            <WarningButton
              buttonText="Delete Image"
              onClick={handleDeleteImage}
            />
          </Paper>
        ) : (
          <WhiteBackgroundButtonWithInput
            buttonText="Upload Image"
            inputType="file"
            inputId="fileInput"
            inputOnChange={handleFileChange}
          />
        )}
      </Box>
    </Paper>
  );
};

export default Solution;
