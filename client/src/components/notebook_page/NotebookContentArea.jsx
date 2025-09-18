import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  Chip,
  Breadcrumbs,
  Link,
  Tooltip,
  Fade,
  Skeleton,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon,
  Description as DescriptionIcon,
  Folder as FolderIcon,
  DataObject as DataObjectIcon,
  AccountTree as AccountTreeIcon,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import NotebookTipTapViewer from "./NotebookTipTapViewer";
import { NodeHooks } from "../../hooks/NodeHooks";
import {
  parseTipTapContent,
  getDefaultTipTapContent,
} from "../../utils/tipTapContentParser";
import NotebookTipTapSolution from "./NotebookTipTapSolution";

const NotebookContentArea = ({
  selectedNotebook,
  selectedNode,
  addClicked,
  setAddClicked,
}) => {
  const { updateNode } = NodeHooks();
  const [isEditing, setIsEditing] = useState(false);
  const [editingContent, setEditingContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset editing state when node changes
  useEffect(() => {
    if (selectedNode) {
      setIsEditing(false);
      setEditingContent(
        parseTipTapContent(selectedNode.content) || getDefaultTipTapContent()
      );
      setHasUnsavedChanges(false);
    } else {
      setIsEditing(false);
      setEditingContent(getDefaultTipTapContent());
      setHasUnsavedChanges(false);
    }
  }, [selectedNode?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle edit mode from parent component
  useEffect(() => {
    if (addClicked && selectedNode) {
      setIsEditing(true);
      setEditingContent(
        parseTipTapContent(selectedNode.content) || getDefaultTipTapContent()
      );
    }
  }, [addClicked, selectedNode]);

  // Generate breadcrumb path
  const generateBreadcrumbs = () => {
    if (!selectedNotebook || !selectedNode) return [];

    try {
      const findNodePath = (tree, targetId, path = []) => {
        if (!tree || !Array.isArray(tree)) return null;

        for (const node of tree) {
          if (!node || !node.id) continue;

          const currentPath = [...path, node];
          if (node.id === targetId) {
            return currentPath;
          }
          if (node.children && node.children.length > 0) {
            const foundPath = findNodePath(
              node.children,
              targetId,
              currentPath
            );
            if (foundPath) return foundPath;
          }
        }
        return null;
      };

      return findNodePath(selectedNotebook.contentTree, selectedNode.id) || [];
    } catch (error) {
      console.error("Error generating breadcrumbs:", error);
      return [];
    }
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleEditStart = () => {
    if (addClicked) {
      alert("Please save your current changes before editing another node.");
      return;
    }
    setIsEditing(true);
    setEditingContent(
      parseTipTapContent(selectedNode?.content) || getDefaultTipTapContent()
    );
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditingContent(
      parseTipTapContent(selectedNode?.content) || getDefaultTipTapContent()
    );
    setHasUnsavedChanges(false);
    setAddClicked(false);
  };

  const handleEditSave = async () => {
    if (!selectedNotebook || !selectedNode) return;

    setIsLoading(true);
    try {
      await updateNode(
        selectedNotebook.id,
        selectedNode.id,
        selectedNode.name,
        JSON.stringify(editingContent)
      );
      setIsEditing(false);
      setHasUnsavedChanges(false);
      setAddClicked(false);
    } catch (error) {
      console.error("Failed to save content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (newContent, imageInfo) => {
    setEditingContent(newContent);
    setHasUnsavedChanges(
      JSON.stringify(newContent) !==
        JSON.stringify(
          parseTipTapContent(selectedNode?.content) || getDefaultTipTapContent()
        )
    );

    if (imageInfo && selectedNode && selectedNotebook) {
      console.log("Image uploaded:", imageInfo);
    }
  };

  if (!selectedNotebook) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          bgcolor: "#0a0a0a",
        }}
      >
        <DataObjectIcon
          sx={{
            fontSize: 80,
            color: grey[700],
            mb: 3,
          }}
        />
        <Typography
          variant="h4"
          sx={{
            color: grey[300],
            fontWeight: 600,
            mb: 2,
            textAlign: "center",
          }}
        >
          Welcome to your personal notebook
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: grey[500],
            textAlign: "center",
            maxWidth: 400,
            lineHeight: 1.6,
          }}
        >
          Select a notebook from the sidebar to view your notes, or create a new
          one to start organizing your coding journey.
        </Typography>
      </Box>
    );
  }

  // Root page selected but no node
  if (!selectedNode) {
    const nodeCount = selectedNotebook?.contentTree?.length || 0;

    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "#0a0a0a",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${grey[800]}`,
            bgcolor: "#0a0a0a",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <AccountTreeIcon sx={{ color: grey[400], fontSize: 28 }} />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  color: grey[50],
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                {selectedNotebook.name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Chip
                  label={`${nodeCount} nodes`}
                  size="small"
                  sx={{
                    bgcolor: alpha(grey[600], 0.3),
                    color: grey[300],
                    fontSize: "0.75rem",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: grey[500],
                  }}
                >
                  Created{" "}
                  {new Date(selectedNotebook.createdAt).toLocaleDateString()}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* Content Area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <FolderIcon
            sx={{
              fontSize: 64,
              color: grey[600],
              mb: 3,
            }}
          />
          <Typography
            variant="h5"
            sx={{
              color: grey[300],
              fontWeight: 600,
              mb: 2,
              textAlign: "center",
            }}
          >
            {nodeCount === 0 ? "Empty Notebook" : "Select a Page to View"}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: grey[500],
              textAlign: "center",
              maxWidth: 400,
              lineHeight: 1.6,
              mb: 3,
            }}
          >
            {nodeCount === 0
              ? "This notebook doesn't have any pages yet. Start by adding a root page from the sidebar."
              : "Choose a page from the tree structure in the sidebar to view and edit its content."}
          </Typography>

          {nodeCount === 0 && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{
                color: grey[400],
                borderColor: grey[700],
                "&:hover": {
                  color: grey[300],
                  borderColor: grey[600],
                },
              }}
            >
              Add First Node
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  // Node selected - show content
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#0a0a0a",
        overflow: "hidden",
      }}
    >
      {/* Header with Breadcrumbs */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${grey[800]}`,
          bgcolor: "#0a0a0a",
        }}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={
            <ChevronRightIcon sx={{ fontSize: 16, color: grey[600] }} />
          }
          sx={{ mb: 2 }}
        >
          <Link
            underline="hover"
            sx={{
              display: "flex",
              alignItems: "center",
              color: grey[400],
              fontSize: "0.875rem",
              "&:hover": { color: grey[300] },
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />
            {selectedNotebook.name}
          </Link>
          {breadcrumbs.map((node, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <Typography
                key={node.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: isLast ? grey[100] : grey[400],
                  fontSize: "0.875rem",
                  fontWeight: isLast ? 600 : 400,
                }}
              >
                <DescriptionIcon sx={{ mr: 0.5, fontSize: 16 }} />
                {node.name}
              </Typography>
            );
          })}
        </Breadcrumbs>

        {/* Node Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                color: grey[50],
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {selectedNode.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: grey[500],
              }}
            >
              {selectedNode.createdAt
                ? `Created ${new Date(
                    selectedNode.createdAt
                  ).toLocaleDateString()}`
                : "No creation date"}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1}>
            {isEditing ? (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CancelIcon />}
                  onClick={handleEditCancel}
                  disabled={isLoading}
                  sx={{
                    color: grey[400],
                    borderColor: grey[700],
                    "&:hover": {
                      color: grey[300],
                      borderColor: grey[600],
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<SaveIcon />}
                  onClick={handleEditSave}
                  disabled={isLoading || !hasUnsavedChanges}
                  sx={{
                    bgcolor: grey[700],
                    color: grey[50],
                    "&:hover": {
                      bgcolor: grey[600],
                    },
                    "&:disabled": {
                      bgcolor: grey[800],
                      color: grey[500],
                    },
                  }}
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </>
            ) : (
              <Tooltip title="Edit Content">
                <IconButton
                  onClick={handleEditStart}
                  disabled={addClicked}
                  sx={{
                    color: grey[400],
                    "&:hover": { color: grey[300] },
                    "&:disabled": { color: grey[600] },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>

        {/* Unsaved Changes Indicator */}
        {hasUnsavedChanges && (
          <Fade in>
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                bgcolor: alpha("#D97706", 0.1),
                border: `1px solid ${alpha("#D97706", 0.3)}`,
                borderRadius: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#F59E0B",
                  fontSize: "0.875rem",
                }}
              >
                You have unsaved changes
              </Typography>
            </Box>
          </Fade>
        )}
      </Box>

      {/* Content Area */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 3,
        }}
      >
        {isLoading ? (
          <Box>
            <Skeleton variant="text" width="80%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={200} />
          </Box>
        ) : (
          <Box
            sx={{
              minHeight: "calc(100% - 2rem)",
            }}
          >
            {isEditing ? (
              <NotebookTipTapSolution
                content={editingContent}
                onContentChange={handleContentChange}
                showDeleteButton={false}
                showHeader={false}
                notebookId={selectedNotebook.id}
                nodeId={selectedNode.id}
                sx={{
                  mb: 0,
                  minHeight: "100%",
                }}
              />
            ) : (
              <NotebookTipTapViewer
                content={selectedNode.content}
                title=""
                notebookId={selectedNotebook.id}
                nodeId={selectedNode.id}
                sx={{
                  mb: 0,
                  minHeight: "100%",
                }}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NotebookContentArea;
