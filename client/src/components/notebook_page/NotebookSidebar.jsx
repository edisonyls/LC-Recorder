import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Button,
  Fade,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Description as DescriptionIcon,
  Add as AddIcon,
  MoreHoriz as MoreHorizIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FiberManualRecord as DotIcon,
  Close as CloseIcon,
  DataObject as DataObjectIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { ActionDialog, WarningDialog } from "./NotebookDialogs";
import { NotebookHooks } from "../../hooks/NotebookHooks";
import { NodeHooks } from "../../hooks/NodeHooks";

const NotebookSidebar = ({
  notebooks,
  selectedNotebook,
  selectedNode,
  onNotebookSelect,
  onNodeSelect,
  addClicked,
}) => {
  const { addNotebook, renameNotebook, deleteNotebook } = NotebookHooks();
  const { addNode, updateNode, deleteNode } = NodeHooks();

  const [expandedNotebooks, setExpandedNotebooks] = useState(new Set());
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [parentNodeId, setParentNodeId] = useState(null);
  const [newName, setNewName] = useState("");
  const [contextItem, setContextItem] = useState(null);

  // Sidebar resize limits
  const minWidth = 240;
  const maxWidth = 600;

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    },
    [isResizing, minWidth, maxWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Filter nodes based on search query
  const filterNodes = useCallback((tree, query) => {
    if (!query) return tree;

    const filterRecursive = (nodes) => {
      return nodes.reduce((acc, node) => {
        const matchesQuery = node.name
          .toLowerCase()
          .includes(query.toLowerCase());
        const filteredChildren = node.children
          ? filterRecursive(node.children)
          : [];

        if (matchesQuery || filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren,
          });
        }

        return acc;
      }, []);
    };

    return filterRecursive(tree);
  }, []);

  const toggleNotebook = (notebookId) => {
    const newExpanded = new Set(expandedNotebooks);
    if (newExpanded.has(notebookId)) {
      newExpanded.delete(notebookId);
    } else {
      newExpanded.add(notebookId);
    }
    setExpandedNotebooks(newExpanded);
  };

  // Expand the child pages
  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // Dialog handlers
  const handleDialogOpen = (type, itemId = null, parentId = null) => {
    setActionType(type);
    setSelectedId(itemId);
    setParentNodeId(parentId);
    setDialogOpen(true);

    if (type === "RenameNotebook") {
      const notebook = notebooks.find((nb) => nb.id === itemId);
      setContextItem(notebook);
      setNewName(notebook?.name || "");
    } else if (type === "RenamePage") {
      const findNodeInTree = (tree, nodeId) => {
        for (const node of tree) {
          if (node.id === nodeId) return node;
          if (node.children?.length > 0) {
            const found = findNodeInTree(node.children, nodeId);
            if (found) return found;
          }
        }
        return null;
      };
      const node = findNodeInTree(selectedNotebook?.contentTree || [], itemId);
      setContextItem(node);
      setNewName(node?.name || "");
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setWarningDialogOpen(false);
    setNewName("");
    setSelectedId(null);
    setParentNodeId(null);
    setContextItem(null);
    setAnchorEl(null);
  };

  const handleSubmit = async () => {
    try {
      switch (actionType) {
        case "AddNotebook":
          await addNotebook(newName);
          break;
        case "RenameNotebook":
          await renameNotebook(selectedId, newName);
          break;
        case "DeleteNotebook":
          await deleteNotebook(selectedId);
          if (selectedNotebook?.id === selectedId) {
            onNotebookSelect(null);
          }
          break;
        case "AddRootPage":
          await addNode(selectedNotebook.id, newName);
          break;
        case "AddChildPage":
          await addNode(selectedNotebook.id, newName, parentNodeId);
          break;
        case "RenamePage":
          if (contextItem) {
            await updateNode(
              selectedNotebook.id,
              selectedId,
              newName,
              contextItem.content
            );
          }
          break;
        case "DeletePage":
          await deleteNode(selectedNotebook.id, selectedId);
          if (selectedNode?.id === selectedId) {
            onNodeSelect(null);
          }
          break;
        default:
          break;
      }
      handleDialogClose();
    } catch (error) {
      console.error("Operation failed:", error);
      // Don't close dialog on error, let user retry or cancel
    }
  };

  const handleMenuClick = (event, type, itemId, parentId = null) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedId(itemId);
    setParentNodeId(parentId);
    setActionType(type);
  };

  const handleMenuItemClick = (action) => {
    setAnchorEl(null);
    if (action === "rename") {
      if (actionType === "notebook") {
        handleDialogOpen("RenameNotebook", selectedId);
      } else {
        handleDialogOpen("RenamePage", selectedId);
      }
    } else if (action === "delete") {
      if (actionType === "notebook") {
        handleDialogOpen("DeleteNotebook", selectedId);
      } else {
        handleDialogOpen("DeletePage", selectedId);
      }
    } else if (action === "addChild") {
      handleDialogOpen("AddChildPage", null, selectedId);
    }
  };

  const handleItemClick = (type, item) => {
    if (addClicked) {
      setWarningDialogOpen(true);
      return;
    }

    if (type === "notebook") {
      onNotebookSelect(item);
      if (!expandedNotebooks.has(item.id)) {
        toggleNotebook(item.id);
      }
    } else if (type === "node") {
      onNodeSelect(item);
    }
  };

  const hasContentInSubtree = (node) => {
    if (node.content && node.content.trim() !== "") {
      return true;
    }

    if (node.children && node.children.length > 0) {
      return node.children.some(hasContentInSubtree);
    }

    return false;
  };

  // Render node tree recursively
  const renderNodeTree = (nodes, level = 0) => {
    const filteredNodes = filterNodes(nodes, searchQuery);

    return filteredNodes.map((node) => {
      const isExpanded = expandedNodes.has(node.id);
      const isSelected = selectedNode?.id === node.id;
      const hasChildren = node.children && node.children.length > 0;
      const hasContent = hasContentInSubtree(node);
      const nodeLevel = level + 1;

      return (
        <Box key={node.id}>
          <ListItem
            disablePadding
            sx={{
              ml: nodeLevel * 1.5,
              borderRadius: 1,
              mb: 0.5,
              bgcolor: isSelected ? alpha(grey[700], 0.3) : "transparent",
              "&:hover": {
                bgcolor: alpha(grey[700], 0.2),
              },
            }}
          >
            <ListItemButton
              onClick={() => handleItemClick("node", node)}
              sx={{
                py: 0.5,
                px: 1,
                borderRadius: 1,
                minHeight: 32,
              }}
            >
              <ListItemIcon sx={{ minWidth: 24, mr: 1 }}>
                {hasChildren ? (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNode(node.id);
                    }}
                    sx={{ p: 0.25 }}
                  >
                    {isExpanded ? (
                      <ExpandMoreIcon sx={{ fontSize: 16, color: grey[400] }} />
                    ) : (
                      <ChevronRightIcon
                        sx={{ fontSize: 16, color: grey[400] }}
                      />
                    )}
                  </IconButton>
                ) : (
                  <DescriptionIcon
                    sx={{
                      fontSize: 16,
                      color: hasContent ? grey[300] : grey[600],
                      ml: 0.25,
                    }}
                  />
                )}
              </ListItemIcon>

              <ListItemText
                primary={node.name}
                primaryTypographyProps={{
                  variant: "body2",
                  sx: {
                    color: isSelected ? grey[50] : grey[300],
                    fontWeight: isSelected ? 600 : 400,
                    fontSize: "0.875rem",
                  },
                }}
              />

              {hasContent && !isSelected && (
                <DotIcon
                  sx={{
                    fontSize: 8,
                    color: grey[500],
                    mr: 0.5,
                  }}
                />
              )}

              <IconButton
                size="small"
                onClick={(e) => handleMenuClick(e, "node", node.id)}
                sx={{
                  p: 0.25,
                  opacity: 0,
                  transition: "opacity 0.2s",
                  ".MuiListItem-root:hover &": { opacity: 1 },
                }}
              >
                <MoreHorizIcon sx={{ fontSize: 14, color: grey[400] }} />
              </IconButton>
            </ListItemButton>
          </ListItem>

          {hasChildren && (
            <Collapse in={isExpanded} timeout={200}>
              {renderNodeTree(node.children, nodeLevel)}
            </Collapse>
          )}
        </Box>
      );
    });
  };

  return (
    <Box
      sx={{
        width: sidebarWidth,
        height: "100%",
        bgcolor: "#0a0a0a",
        borderRight: `1px solid ${grey[800]}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${grey[800]}`,
          bgcolor: "#0a0a0a",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              color: grey[50],
              fontWeight: 600,
              fontSize: "1rem",
              flex: 1,
            }}
          >
            Notebooks
          </Typography>

          <Tooltip title="Search">
            <IconButton
              size="small"
              onClick={() => setShowSearch(!showSearch)}
              sx={{
                color: grey[400],
                "&:hover": { color: grey[300] },
              }}
            >
              {showSearch ? (
                <CloseIcon sx={{ fontSize: 18 }} />
              ) : (
                <SearchIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="New Notebook">
            <IconButton
              size="small"
              onClick={() => handleDialogOpen("AddNotebook")}
              sx={{
                color: grey[400],
                "&:hover": { color: grey[300] },
              }}
            >
              <AddIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Search Bar */}
        <Collapse in={showSearch}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: grey[500] }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: grey[900],
                borderRadius: 1,
                "& fieldset": {
                  borderColor: grey[700],
                },
                "&:hover fieldset": {
                  borderColor: grey[600],
                },
                "&.Mui-focused fieldset": {
                  borderColor: grey[500],
                },
              },
              "& .MuiInputBase-input": {
                color: grey[200],
                fontSize: "0.875rem",
              },
            }}
          />
        </Collapse>
      </Box>

      {/* Sidebar Content */}
      <Box sx={{ flex: 1, overflow: "auto", py: 1 }}>
        <List sx={{ px: 1 }}>
          {notebooks.map((notebook) => {
            const isExpanded = expandedNotebooks.has(notebook.id);
            const isSelected = selectedNotebook?.id === notebook.id;
            const hasNodes =
              notebook.contentTree && notebook.contentTree.length > 0;

            return (
              <Box key={notebook.id} sx={{ mb: 1 }}>
                <ListItem
                  disablePadding
                  sx={{
                    borderRadius: 1,
                    bgcolor: isSelected ? alpha(grey[700], 0.4) : "transparent",
                    "&:hover": {
                      bgcolor: alpha(grey[700], 0.3),
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => handleItemClick("notebook", notebook)}
                    sx={{
                      py: 1,
                      px: 1.5,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNotebook(notebook.id);
                        }}
                        sx={{ p: 0.25 }}
                      >
                        {isExpanded ? (
                          <FolderOpenIcon
                            sx={{ fontSize: 18, color: grey[400] }}
                          />
                        ) : (
                          <FolderIcon sx={{ fontSize: 18, color: grey[400] }} />
                        )}
                      </IconButton>
                    </ListItemIcon>

                    <ListItemText
                      primary={notebook.name}
                      primaryTypographyProps={{
                        variant: "subtitle2",
                        sx: {
                          color: isSelected ? grey[50] : grey[200],
                          fontWeight: isSelected ? 700 : 600,
                          fontSize: "0.875rem",
                        },
                      }}
                    />

                    {hasNodes && (
                      <Chip
                        label={notebook.contentTree.length}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.75rem",
                          bgcolor: alpha(grey[600], 0.3),
                          color: grey[300],
                          mr: 1,
                        }}
                      />
                    )}

                    <IconButton
                      size="small"
                      onClick={(e) =>
                        handleMenuClick(e, "notebook", notebook.id)
                      }
                      sx={{
                        p: 0.25,
                        opacity: 0,
                        transition: "opacity 0.2s",
                        ".MuiListItem-root:hover &": { opacity: 1 },
                      }}
                    >
                      <MoreHorizIcon sx={{ fontSize: 16, color: grey[400] }} />
                    </IconButton>
                  </ListItemButton>
                </ListItem>

                {/* Notebook Actions Row */}
                {isSelected && (
                  <Fade in={true} timeout={300}>
                    <Box sx={{ mt: 0.5, mb: 1, ml: 1.5 }}>
                      <Button
                        size="small"
                        startIcon={
                          <AddCircleOutlineIcon sx={{ fontSize: 14 }} />
                        }
                        onClick={() => handleDialogOpen("AddRootPage")}
                        sx={{
                          color: grey[400],
                          fontSize: "0.75rem",
                          textTransform: "none",
                          "&:hover": {
                            color: grey[300],
                            bgcolor: alpha(grey[700], 0.2),
                          },
                        }}
                      >
                        Add Page
                      </Button>
                    </Box>
                  </Fade>
                )}

                {/* Node Tree */}
                <Collapse in={isExpanded} timeout={200}>
                  {hasNodes && (
                    <List sx={{ py: 0 }}>
                      {renderNodeTree(notebook.contentTree)}
                    </List>
                  )}
                </Collapse>
              </Box>
            );
          })}
        </List>

        {/* Empty State */}
        {notebooks.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              px: 2,
            }}
          >
            <DataObjectIcon
              sx={{
                fontSize: 48,
                color: grey[600],
                mb: 2,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: grey[500],
                textAlign: "center",
                mb: 2,
              }}
            >
              No notebooks yet
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => handleDialogOpen("AddNotebook")}
              sx={{
                color: grey[400],
                borderColor: grey[700],
                "&:hover": {
                  color: grey[300],
                  borderColor: grey[600],
                },
              }}
            >
              Create First Notebook
            </Button>
          </Box>
        )}
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            bgcolor: grey[900],
            border: `1px solid ${grey[700]}`,
            "& .MuiMenuItem-root": {
              color: grey[200],
              fontSize: "0.875rem",
              "&:hover": {
                bgcolor: alpha(grey[700], 0.3),
              },
            },
          },
        }}
      >
        {actionType === "notebook" && [
          <MenuItem key="rename" onClick={() => handleMenuItemClick("rename")}>
            <EditIcon sx={{ mr: 1, fontSize: 16 }} />
            Rename
          </MenuItem>,
          <MenuItem key="delete" onClick={() => handleMenuItemClick("delete")}>
            <DeleteIcon sx={{ mr: 1, fontSize: 16, color: "error.main" }} />
            Delete
          </MenuItem>,
        ]}

        {actionType === "node" && [
          <MenuItem
            key="addChild"
            onClick={() => handleMenuItemClick("addChild")}
          >
            <AddIcon sx={{ mr: 1, fontSize: 16 }} />
            Add Page
          </MenuItem>,
          <MenuItem key="rename" onClick={() => handleMenuItemClick("rename")}>
            <EditIcon sx={{ mr: 1, fontSize: 16 }} />
            Rename
          </MenuItem>,
          <Divider key="divider" sx={{ bgcolor: grey[700] }} />,
          <MenuItem key="delete" onClick={() => handleMenuItemClick("delete")}>
            <DeleteIcon sx={{ mr: 1, fontSize: 16, color: "error.main" }} />
            Delete
          </MenuItem>,
        ]}
      </Menu>

      {/* Dialogs */}
      <ActionDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleSubmit}
        title={
          actionType === "AddNotebook"
            ? "New Notebook"
            : actionType === "RenameNotebook"
            ? "Rename Notebook"
            : actionType === "DeleteNotebook"
            ? "Delete Notebook"
            : actionType === "AddRootPage"
            ? "Add Root Page"
            : actionType === "AddChildPage"
            ? "Add Child Page"
            : actionType === "RenamePage"
            ? "Rename Page"
            : actionType === "DeletePage"
            ? "Delete Page"
            : ""
        }
        actionType={actionType}
        newName={newName}
        setNewName={setNewName}
        isDelete={actionType.includes("Delete")}
        itemName={contextItem?.name}
      />

      <WarningDialog
        dialogOpen={warningDialogOpen}
        onClose={() => setWarningDialogOpen(false)}
        onCancel={() => setWarningDialogOpen(false)}
        title="Unsaved Changes"
        text="You have unsaved changes. Please save or discard them before switching to another page."
        optionNumber={1}
      />

      {/* Resize Handle */}
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 4,
          height: "100%",
          cursor: "col-resize",
          bgcolor: "transparent",
          "&:hover": {
            bgcolor: alpha(grey[600], 0.3),
          },
          zIndex: 10,
        }}
      />
    </Box>
  );
};

export default NotebookSidebar;
