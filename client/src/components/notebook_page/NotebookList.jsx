import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { grey } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ActionDialog, WarningDialog } from "./NotebookDialogs";
import { NotebookHooks } from "../../hooks/NotebookHooks";

const NotebookList = ({ notebook, handleNotebookClick, addClicked }) => {
  const { addNotebook, renameNotebook, deleteNotebook } = NotebookHooks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [warningDialogOpen, setWaringDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [newName, setNewName] = useState("");
  const [selectedNotebook, setSelectedNotebook] = useState(null);

  const open = Boolean(anchorEl);

  const handleDialogOpen = (type) => {
    setActionType(type);
    setDialogOpen(true);
    if (type === "Rename") {
      const selectedNotebook = notebook.find(
        (notebook) => notebook.id === selectedId
      );
      setSelectedNotebook(selectedNotebook);
      setNewName(selectedNotebook ? selectedNotebook.name : "");
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewName("");
  };

  const handleSubmit = () => {
    switch (actionType) {
      case "Add":
        addNotebook(newName);
        setDialogOpen(false);
        break;
      case "Rename":
        renameNotebook(selectedId, newName);
        setDialogOpen(false);
        break;
      case "Delete":
        deleteNotebook(selectedId);
        handleNotebookClick(null);
        setSelectedNotebook(null);
        setSelectedId(null);
        setDialogOpen(false);
        break;
      default:
        break;
    }
    handleDialogClose();
  };

  const handleMenuItemClick = (type) => {
    setAnchorEl(null);
    handleDialogOpen(type);
  };

  const handleListItemClick = (notebook) => {
    if (addClicked) {
      setWaringDialogOpen(true);
      return;
    }
    handleNotebookClick(notebook);
    setSelectedNotebook(notebook);
    setSelectedId(notebook.id);
  };

  return (
    <Box sx={{ width: "100%", p: 1 }}>
      <List>
        <ListItem>
          <Typography>Notebooks</Typography>
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={{ marginLeft: "auto", color: grey[50] }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={() => setAnchorEl(null)}
            sx={{
              padding: 0,
              "& .MuiDialog-paper": { bgcolor: grey[900], color: grey[50] },
            }}
          >
            <MenuItem
              onClick={() => handleMenuItemClick("Add")}
              sx={{ color: grey[900] }}
            >
              Add
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuItemClick("Rename")}
              sx={{ color: grey[900] }}
              disabled={!selectedId}
            >
              {selectedNotebook ? `Rename ${selectedNotebook.name}` : "Rename"}
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuItemClick("Delete")}
              sx={{ color: grey[900] }}
              disabled={!selectedId}
            >
              {selectedNotebook ? `Delete ${selectedNotebook.name}` : "Delete"}
            </MenuItem>
          </Menu>
        </ListItem>
        <Divider sx={{ background: grey[50] }} />
        {notebook.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: 300,
            }}
          >
            <Typography>No data</Typography>
            <Tooltip
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: 170,
                    fontSize: "12px",
                    p: 1,
                  },
                },
              }}
              title="Please click on the dot icon above to create a new Notebook"
            >
              <IconButton>
                <HelpOutlineIcon sx={{ color: "#fff", fontSize: "1rem" }} />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Box
            sx={{
              height: "100%",
              minHeight: 300,
            }}
          >
            {notebook.map((book) => (
              <ListItem
                key={book.id}
                disablePadding
                sx={{
                  backgroundColor:
                    selectedId === book.id ? grey[700] : "transparent",
                  "&:hover": {
                    backgroundColor: grey[700],
                  },
                }}
              >
                <ListItemButton onClick={() => handleListItemClick(book)}>
                  <ListItemText
                    primary={book.name}
                    primaryTypographyProps={{ sx: { color: grey[50] } }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </Box>
        )}
      </List>
      <ActionDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        actionType={actionType}
        notebookName="Notebook"
        newName={newName}
        setNewName={setNewName}
        onSubmit={handleSubmit}
      />
      <WarningDialog
        title="You are editing."
        text="Save or amend your changes before selecting the others."
        optionNumber={1}
        dialogOpen={warningDialogOpen}
        onClose={() => {
          setWaringDialogOpen(false);
        }}
      />
    </Box>
  );
};

export default NotebookList;
