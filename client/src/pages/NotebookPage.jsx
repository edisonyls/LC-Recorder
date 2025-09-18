import { useState, useEffect } from "react";
import { Box, CircularProgress, Backdrop } from "@mui/material";
import AuthenticatedNavbar from "../components/navbar/AuthenticatedNavbar";
import NotebookSidebar from "../components/notebook_page/NotebookSidebar";
import NotebookContentArea from "../components/notebook_page/NotebookContentArea";
import { NotebookHooks } from "../hooks/NotebookHooks";
import { useNotebook } from "../context/notebookContext";
import Footer from "../components/Footer";
import { UserHooks } from "../hooks/userHooks/UserHooks";

const NotebookPage = () => {
  const { state } = useNotebook();
  const { notebooks, loading } = state;
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [addClicked, setAddClicked] = useState(false);
  const { fetchNotebooks } = NotebookHooks();
  const { getCurrentUser } = UserHooks();

  useEffect(() => {
    getCurrentUser();
  }, []); // eslint-disable-line

  useEffect(() => {
    fetchNotebooks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedNotebook) {
      const updatedNotebook = notebooks.find(
        (nb) => nb.id === selectedNotebook.id
      );
      // Update selectedNotebook if it has been found in global state and is different
      if (
        updatedNotebook &&
        JSON.stringify(updatedNotebook) !== JSON.stringify(selectedNotebook)
      ) {
        setSelectedNotebook(updatedNotebook);
      }
    }
  }, [notebooks, selectedNotebook]);

  // Update selected node when notebooks change
  useEffect(() => {
    if (selectedNotebook && selectedNode && selectedNotebook.contentTree) {
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
        selectedNotebook.contentTree,
        selectedNode.id
      );
      if (
        updatedSelectedNode &&
        JSON.stringify(updatedSelectedNode) !== JSON.stringify(selectedNode)
      ) {
        setSelectedNode(updatedSelectedNode);
      }
    }
  }, [notebooks, selectedNode, selectedNotebook]);

  const handleNotebookSelect = (notebook) => {
    setSelectedNotebook(notebook);
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
        <NotebookSidebar
          notebooks={notebooks}
          selectedNotebook={selectedNotebook}
          selectedNode={selectedNode}
          onNotebookSelect={handleNotebookSelect}
          onNodeSelect={handleNodeSelect}
          addClicked={addClicked}
        />

        {/* Main Content Area */}
        <NotebookContentArea
          selectedNotebook={selectedNotebook}
          selectedNode={selectedNode}
          addClicked={addClicked}
          setAddClicked={setAddClicked}
        />
      </Box>

      <Footer />
    </Box>
  );
};

export default NotebookPage;
