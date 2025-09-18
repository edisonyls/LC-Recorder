import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { grey } from "@mui/material/colors";

const NotebookStats = ({ userId }) => {
  return (
    <Card
      sx={{
        bgcolor: "#1a1a1a",
        border: `1px solid ${grey[800]}`,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            color: grey[200],
            fontWeight: 600,
            mb: 2,
          }}
        >
          Notebook Statistics
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: grey[400],
            }}
          >
            Total Notebooks: 0
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: grey[400],
            }}
          >
            Total Pages: 0
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: grey[400],
            }}
          >
            Last Updated: Never
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotebookStats;
