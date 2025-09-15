import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";
import AuthenticatedNavbar from "../components/navbar/AuthenticatedNavbar";
import GenericSpinner from "../components/generic/GenericSpinner";
import { grey } from "@mui/material/colors";
import Footer from "../components/Footer";
import AlgorithmDialog from "../components/algorithm_page_components/AlgorithmDialog";
import { BlackBackgroundButton } from "../components/generic/GenericButton";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useAlgorithm } from "../context/AlgorithmContext";
import { AlgorithmHooks } from "../hooks/AlgorithmHooks";
import AlgorithmCard from "../components/algorithm_page_components/AlgorithmCard";
import { UserHooks } from "../hooks/userHooks/UserHooks";

const AlgorithmPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const { state } = useAlgorithm();
  const { algorithms, loading } = state;
  const { fetchAlgorithms, deleteAlgorithm } = AlgorithmHooks();
  const { getCurrentUser } = UserHooks();

  useEffect(() => {
    getCurrentUser();
  }, []); // eslint-disable-line

  useEffect(() => {
    fetchAlgorithms();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const navigate = useNavigate();

  const handleUpdate = (algorithm) => {
    navigate("/new-algorithm", { state: { algorithm: algorithm } });
  };

  const handleClickOpen = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAlgorithm(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#121212",
        }}
      >
        <GenericSpinner color="white" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <AuthenticatedNavbar />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#121212",
          mt: -4,
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "80%",
            mb: 2,
            mt: 4,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: grey[50] }}>
            Algorithms
          </Typography>
          <BlackBackgroundButton
            buttonText="New Algorithm"
            onClick={() =>
              navigate("/new-algorithm", { state: { algorithm: null } })
            }
            startIcon={<AddIcon />}
          />
        </Box>

        <Grid container spacing={2} sx={{ width: "80%", mb: 2 }}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <FormControl
                variant="outlined"
                sx={{
                  backgroundColor: "#121212",
                  borderRadius: 1,
                  mr: 2,
                  flexGrow: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "white",
                  },
                }}
              >
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortOption}
                  onChange={handleSortChange}
                  label="Sort By"
                >
                  <MenuItem value="default">Default</MenuItem>
                  <MenuItem value="category">Category</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  backgroundColor: "#121212",
                  borderRadius: 1,
                  flexGrow: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "white",
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={3}
          sx={{ padding: "20px", width: "80%", marginBottom: "1rem" }}
        >
          {algorithms.map((algorithm, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <AlgorithmCard
                algorithm={algorithm}
                onOpen={handleClickOpen}
                onDelete={deleteAlgorithm}
                onEdit={() => handleUpdate(algorithm)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Footer />

      {selectedAlgorithm && (
        <AlgorithmDialog
          open={open}
          onClose={handleClose}
          algorithm={selectedAlgorithm}
        />
      )}
    </Box>
  );
};

export default AlgorithmPage;
