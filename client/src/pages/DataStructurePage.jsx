import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Container,
  Typography,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import AuthenticatedNavbar from "../components/navbar/AuthenticatedNavbar";
import DataStructureList from "../components/data_structure_page/DataStructureList";
import NodeList from "../components/data_structure_page/NodeList";
import ContentDisplay from "../components/data_structure_page/ContentDisplay";
import { DataStructureHooks } from "../hooks/DataStructureHooks";
import { useDataStructure } from "../context/dataStructureContext";
import Footer from "../components/Footer";
import { UserHooks } from "../hooks/userHooks/UserHooks";

const DataStructurePage = () => {
  const { state } = useDataStructure();
  const { dataStructures, loading } = state;
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [selectedNode, setSelectedNode] = useState("");
  const [addClicked, setAddClicked] = useState(false);
  const [content, setContent] = useState(null);
  const { fetchDataStructures } = DataStructureHooks();
  const { getCurrentUser } = UserHooks();

  useEffect(() => {
    getCurrentUser();
  }, []); // eslint-disable-line

  useEffect(() => {
    fetchDataStructures();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedStructure) {
      // Find the selected structure from the data structure
      const updatedStructure = dataStructures.find(
        (ds) => ds.id === selectedStructure.id
      );
      // Update selectedStructure if it has been found in global state and is different
      if (
        updatedStructure &&
        JSON.stringify(updatedStructure) !== JSON.stringify(selectedStructure)
      ) {
        setSelectedStructure(updatedStructure);
      }
    }
  }, [dataStructures, selectedStructure]);

  // updated selectedNode
  useEffect(() => {
    if (selectedStructure && selectedNode) {
      const updatedSelectedStructure = dataStructures.find(
        (ds) => ds.id === selectedStructure.id
      );
      if (updatedSelectedStructure) {
        const updatedSelectedNode = updatedSelectedStructure.nodes.find(
          (ss) => ss.id === selectedNode.id
        );
        if (
          updatedSelectedNode &&
          JSON.stringify(updatedSelectedNode) !== JSON.stringify(selectedNode)
        ) {
          setSelectedNode(updatedSelectedNode);
        }
      }
    }
  }, [dataStructures, selectedNode, selectedStructure]);

  useEffect(() => {
    // Check if the selectedNode is not null and has content
    if (selectedNode && selectedNode.content !== undefined) {
      setContent(selectedNode.content);
    } else {
      // Reset content if there's no selectedNode or if it has no content
      setContent(null);
    }
  }, [selectedNode]);

  const handleStructureClick = (structure) => {
    setSelectedStructure(structure);
    setSelectedNode(null);
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    if (node !== null && node.content !== null) {
      setContent(node.content);
    } else {
      setContent(null);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <AuthenticatedNavbar />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#121212",
          mt: -4,
          pt: 2,
          pb: 6,
        }}
      >
        <Container component="main" maxWidth="lg" sx={{ pt: 2, pb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ color: grey[50] }}>
            Data Structures
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  bgcolor: grey[800],
                  color: grey[50],
                  borderRadius: 1,
                  minHeight: 300,
                  overflow: "auto",
                }}
              >
                <DataStructureList
                  sx={{ flex: 1 }}
                  dataStructure={dataStructures}
                  handleStructureClick={handleStructureClick}
                  addClicked={addClicked}
                />
                <NodeList
                  sx={{ flex: 1 }}
                  selectedStructure={selectedStructure}
                  dataStructure={dataStructures}
                  handleNodeClick={handleNodeClick}
                  addClicked={addClicked}
                  selectedNodeId={selectedNode ? selectedNode.id : null}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  bgcolor: grey[800],
                  color: grey[50],
                  p: 2,
                  borderRadius: 1,
                  minHeight: 365,
                  overflow: "auto",
                }}
              >
                <ContentDisplay
                  selectedStructure={selectedStructure}
                  selectedNode={selectedNode}
                  addClicked={addClicked}
                  setAddClicked={setAddClicked}
                  content={content}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default DataStructurePage;
