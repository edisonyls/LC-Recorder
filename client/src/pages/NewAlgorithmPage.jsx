import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import { grey } from "@mui/material/colors";
import AuthenticatedNavbar from "../components/navbar/AuthenticatedNavbar";
import Footer from "../components/Footer";
import AlgorithmForm from "../components/algorithm_page_components/AlgorithmForm";
import AlgorithmHeader from "../components/algorithm_page_components/AlgorithmHeader";
import { useLocation } from "react-router-dom";
import UpdateAlgorithmForm from "../components/algorithm_page_components/UpdateAlgorithmForm";
import { UserHooks } from "../hooks/userHooks/UserHooks";

const NewAlgorithmPage = () => {
  const [isDataEntered, setDataEntered] = useState(false);

  const location = useLocation();
  const algorithm = location.state?.algorithm || null;
  const { getCurrentUser } = UserHooks();

  useEffect(() => {
    getCurrentUser();
  }, []); // eslint-disable-line

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#121212",
      }}
    >
      <AuthenticatedNavbar />
      <Container
        component="main"
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: grey[50],
          flexGrow: 1,
        }}
      >
        {algorithm === null ? (
          <>
            <AlgorithmHeader isDataEntered={isDataEntered} />
            <AlgorithmForm setDataEntered={setDataEntered} />
          </>
        ) : (
          <>
            <AlgorithmHeader
              isDataEntered={isDataEntered}
              algorithm={algorithm}
            />
            <UpdateAlgorithmForm
              setDataEntered={setDataEntered}
              algorithm={algorithm}
            />
          </>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default NewAlgorithmPage;
