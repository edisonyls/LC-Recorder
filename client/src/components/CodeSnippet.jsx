import React from "react";
import { Box, Typography } from "@mui/material";

const CodeSnippet = ({ code }) => {
  return (
    <Box
      component="pre"
      sx={{
        display: "block",
        padding: "12px",
        overflowX: "auto",
        backgroundColor: "#111111",
        borderRadius: "4px",
        border: "1px solid #333333",
        color: "#FFFFFF",
        fontSize: "0.875rem",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
      }}
    >
      <Typography
        variant="body2"
        component="code"
        sx={{
          wordBreak: "break-all",
          fontFamily: '"JetBrains Mono", monospace',
          color: "#FFFFFF",
        }}
      >
        {code}
      </Typography>
    </Box>
  );
};

export default CodeSnippet;
