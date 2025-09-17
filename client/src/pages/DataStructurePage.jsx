import { useState, useEffect } from "react";
import { Box, CircularProgress, Backdrop } from "@mui/material";
import AuthenticatedNavbar from "../components/navbar/AuthenticatedNavbar";
import DataStructureSidebar from "../components/data_structure_page/DataStructureSidebar";
import DataStructureContentArea from "../components/data_structure_page/DataStructureContentArea";
import { DataStructureHooks } from "../hooks/DataStructureHooks";
import { useDataStructure } from "../context/dataStructureContext";
import Footer from "../components/Footer";
import { UserHooks } from "../hooks/userHooks/UserHooks";

const DataStructurePage = () => {
  const { state } = useDataStructure();
  const { dataStructures, loading } = state;
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [addClicked, setAddClicked] = useState(false);
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

  // Update selected node when data structures change
  useEffect(() => {
    if (selectedStructure && selectedNode && selectedStructure.contentTree) {
      const findNodeInTree = (tree, nodeId) => {
        for (const node of tree) {
          if (node.id === nodeId) {
            return node;
          }
          if (node.children && node.children.length > 0) {
            const found = findNodeInTree(node.children, nodeId);
            if (found) return found;
          }
        }
        return null;
      };

      const updatedSelectedNode = findNodeInTree(
        selectedStructure.contentTree,
        selectedNode.id
      );
      if (
        updatedSelectedNode &&
        JSON.stringify(updatedSelectedNode) !== JSON.stringify(selectedNode)
      ) {
        setSelectedNode(updatedSelectedNode);
      }
    }
  }, [dataStructures, selectedNode, selectedStructure]);

  const handleStructureSelect = (structure) => {
    setSelectedStructure(structure);
    setSelectedNode(null);
    setAddClicked(false);
  };

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
    setAddClicked(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#0a0a0a",
      }}
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <AuthenticatedNavbar />

      {/* Main Content Layout */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          mt: -4,
          pt: 2,
          bgcolor: "#0a0a0a",
          overflow: "hidden",
        }}
      >
        <DataStructureSidebar
          dataStructures={dataStructures}
          selectedStructure={selectedStructure}
          selectedNode={selectedNode}
          onStructureSelect={handleStructureSelect}
          onNodeSelect={handleNodeSelect}
          addClicked={addClicked}
        />

        {/* Main Content Area */}
        <DataStructureContentArea
          selectedStructure={selectedStructure}
          selectedNode={selectedNode}
          addClicked={addClicked}
          setAddClicked={setAddClicked}
        />
      </Box>

      <Footer />
    </Box>
  );
};

export default DataStructurePage;
