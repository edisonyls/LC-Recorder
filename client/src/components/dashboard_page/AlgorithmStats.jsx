import React from "react";
import { Box, IconButton, Typography, Card, CardContent } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

const AlgorithmStats = ({ userId }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        width: "100%",
        minHeight: "140px",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            mb: 2,
          }}
        >
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <Typography variant="h5">Algorithm Stats</Typography>
          </Box>
          <IconButton
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "white",
                color: "black",
              },
              fontSize: "1.8rem",
            }}
            onClick={() => navigate("/algorithm")}
          >
            <ArrowForwardIcon sx={{ fontSize: "inherit" }} />
          </IconButton>
        </Box>
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" sx={{ color: "cyan" }}>
            Total Algorithm You Have Recorded:{" "}
            <span
              style={{
                padding: "2px 5px",
                borderRadius: "5px",
                backgroundColor: "limegreen",
                color: "black",
                display: "inline-block",
              }}
            >
              N/A
            </span>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AlgorithmStats;
