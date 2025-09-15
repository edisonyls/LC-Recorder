import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { Image } from "@tiptap/extension-image";
import TipTapMenuBar from "./TipTapMenuBar";
import {
  parseTipTapContent,
  getDefaultTipTapContent,
} from "../../utils/tipTapContentParser";

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit,
  Image,
];

const TipTapSolution = ({
  solutionId,
  deleteSolution,
  showDeleteButton,
  content,
  onContentChange,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const parsedContent = parseTipTapContent(content);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    deleteSolution();
    handleMenuClose();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <Box sx={{ flex: 1 }} />
        <Typography variant="h6">Solution {solutionId}</Typography>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          {showDeleteButton && (
            <>
              <IconButton
                onClick={handleMenuClick}
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    backgroundColor: "action.hover",
                    color: "text.primary",
                  },
                }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem
                  onClick={handleDeleteClick}
                  sx={{
                    color: "error.main",
                    "&:hover": {
                      backgroundColor: "error.light",
                      color: "error.dark",
                    },
                  }}
                >
                  <DeleteForeverIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                  Delete Solution
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{ marginBottom: "1rem", marginLeft: "1rem" }}
      >
        Solution Content
      </Typography>

      <Paper
        elevation={1}
        sx={{
          minHeight: 300,
          backgroundColor: "#111111",
          border: "1px solid #333333",
          borderRadius: "4px",
          "& .ProseMirror": {
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.875rem",
            lineHeight: 1.75,
            color: "#FFFFFF",
            backgroundColor: "#111111",
            padding: "16px",
            minHeight: "240px",
            outline: "none",
            border: "none",
            borderRadius: "0 0 4px 4px",
            "& p": {
              margin: "0 0 8px 0",
              "&:last-child": {
                margin: 0,
              },
            },
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 600,
              color: "#FFFFFF",
              margin: "16px 0 8px 0",
              "&:first-of-type": {
                marginTop: 0,
              },
            },
            "& h1": { fontSize: "2rem" },
            "& h2": { fontSize: "1.75rem" },
            "& h3": { fontSize: "1.5rem" },
            "& h4": { fontSize: "1.25rem" },
            "& h5": { fontSize: "1.125rem" },
            "& h6": { fontSize: "1rem" },
            "& code": {
              backgroundColor: "#1A1A1A",
              color: "#A1A1AA",
              padding: "2px 4px",
              borderRadius: "4px",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.8em",
              border: "1px solid #333333",
            },
            "& pre": {
              backgroundColor: "#0A0A0A",
              color: "#FFFFFF",
              padding: "16px",
              borderRadius: "4px",
              border: "1px solid #333333",
              margin: "8px 0",
              overflow: "auto",
              "& code": {
                backgroundColor: "transparent",
                padding: 0,
                border: "none",
                color: "inherit",
              },
            },
            "& blockquote": {
              borderLeft: "4px solid #333333",
              paddingLeft: "16px",
              margin: "8px 0",
              fontStyle: "italic",
              color: "#A1A1AA",
            },
            "& ul, & ol": {
              paddingLeft: "24px",
              margin: "8px 0",
            },
            "& li": {
              margin: "4px 0",
            },
            "& hr": {
              border: "none",
              borderTop: "2px solid #333333",
              margin: "16px 0",
            },
            "& img": {
              maxWidth: "100%",
              width: "auto",
              height: "auto",
              borderRadius: "4px",
              border: "1px solid #333333",
              margin: "8px auto",
              display: "block",
              objectFit: "contain",
              maxHeight: "250px",
              cursor: "pointer",
            },
            "& strong": {
              color: "#FFFFFF",
              fontWeight: 600,
            },
            "& em": {
              color: "#A1A1AA",
            },
            "& a": {
              color: "#FFFFFF",
              textDecoration: "underline",
              "&:hover": {
                color: "#A1A1AA",
              },
            },
          },
        }}
      >
        <EditorProvider
          extensions={extensions}
          content={parsedContent || getDefaultTipTapContent()}
          onUpdate={({ editor }) => {
            const currentContent = editor.getJSON();
            onContentChange(currentContent);
          }}
          slotBefore={
            <TipTapMenuBar
              solutionId={solutionId}
              onContentChange={(content, imageInfo) => {
                if (imageInfo) {
                  onContentChange(content, imageInfo);
                } else {
                  onContentChange(content);
                }
              }}
            />
          }
        />
      </Paper>
    </Paper>
  );
};

export default TipTapSolution;
