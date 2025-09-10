import React, { useState } from "react";
import { useCurrentEditor } from "@tiptap/react";
import { GithubPicker } from "react-color";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Popover,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import CodeIcon from "@mui/icons-material/Code";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import ImageIcon from "@mui/icons-material/Image";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DataArrayIcon from "@mui/icons-material/DataArray";

const TipTapMenuBar = ({ solutionId, onContentChange }) => {
  const { editor } = useCurrentEditor();
  const [anchorEl, setAnchorEl] = useState(null);
  const [colorAnchorEl, setColorAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  if (!editor) {
    return null;
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (level) => {
    setAnchorEl(null);
    updateHeadingLevel(level);
  };

  const updateHeadingLevel = (level) => {
    const intLevel = parseInt(level, 10);
    if (intLevel) {
      editor.chain().focus().toggleHeading({ level: intLevel }).run();
    } else {
      editor.chain().focus().setParagraph().run();
    }
  };

  const getCurrentHeadingLevel = () => {
    if (editor.isActive("paragraph")) {
      return "Normal Text";
    }
    for (let level = 1; level <= 6; level++) {
      if (editor.isActive("heading", { level })) {
        return `Heading ${level}`;
      }
    }
    return "Normal Text";
  };

  const handleColorChange = (color) => {
    if (editor) {
      editor.chain().focus().setColor(color.hex).run();
    }
  };

  const openColorPicker = (event) => {
    setColorAnchorEl(event.currentTarget);
  };

  const closeColorPicker = () => {
    setColorAnchorEl(null);
  };

  const colorPickerOpen = Boolean(colorAnchorEl);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const imageId = `temp_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      editor.chain().focus().setImage({ src: imageUrl, alt: imageId }).run();

      if (onContentChange) {
        const currentContent = editor.getJSON();
        onContentChange(currentContent, { file, imageId, blobUrl: imageUrl });
      }
    } else {
      alert("Please select an image file.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        p: 1.5,
        borderBottom: "1px solid #333333",
        backgroundColor: "#1A1A1A",
        borderRadius: "4px 4px 0 0",
        flexWrap: "wrap",
        border: "1px solid #333333",
      }}
    >
      {/* Heading dropdown */}
      <IconButton
        aria-label="formatting-options"
        onClick={handleMenuClick}
        size="small"
        sx={{
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        }}
      >
        <KeyboardArrowDownIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleMenuClose("")}
        PaperProps={{
          sx: {
            backgroundColor: "#1A1A1A",
            border: "1px solid #333333",
            "& .MuiMenuItem-root": {
              color: "#FFFFFF",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.875rem",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
              "&.Mui-selected": {
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.16)",
                },
              },
            },
          },
        }}
      >
        {[
          "Normal Text",
          ...[1, 2, 3, 4, 5, 6].map((level) => `Heading ${level}`),
        ].map((option, index) => (
          <MenuItem
            key={option}
            selected={option === getCurrentHeadingLevel()}
            onClick={() => handleMenuClose(index.toString())}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>

      {/* Color picker */}
      <Tooltip title="Text Color">
        <IconButton
          onClick={openColorPicker}
          size="small"
          sx={{
            color: editor.getAttributes("textStyle")?.color || "#FFFFFF",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          <PaletteIcon />
        </IconButton>
      </Tooltip>
      <Popover
        open={colorPickerOpen}
        anchorEl={colorAnchorEl}
        onClose={closeColorPicker}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <GithubPicker
          colors={customColors}
          color={editor.getAttributes("textStyle")?.color}
          onChangeComplete={handleColorChange}
        />
      </Popover>

      {/* Text formatting */}
      <Tooltip title="Bold">
        <span>
          <IconButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            size="small"
            sx={{
              color: editor.isActive("bold") ? "#FFFFFF" : "#A1A1AA",
              backgroundColor: editor.isActive("bold")
                ? "rgba(255, 255, 255, 0.12)"
                : "transparent",
              "&:hover": {
                backgroundColor: editor.isActive("bold")
                  ? "rgba(255, 255, 255, 0.16)"
                  : "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            <FormatBoldIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Italic">
        <span>
          <IconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            size="small"
            sx={{
              color: editor.isActive("italic") ? "#FFFFFF" : "#A1A1AA",
              backgroundColor: editor.isActive("italic")
                ? "rgba(255, 255, 255, 0.12)"
                : "transparent",
              "&:hover": {
                backgroundColor: editor.isActive("italic")
                  ? "rgba(255, 255, 255, 0.16)"
                  : "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            <FormatItalicIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Strike Through">
        <span>
          <IconButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            size="small"
            sx={{
              color: editor.isActive("strike") ? "#FFFFFF" : "#A1A1AA",
              backgroundColor: editor.isActive("strike")
                ? "rgba(255, 255, 255, 0.12)"
                : "transparent",
              "&:hover": {
                backgroundColor: editor.isActive("strike")
                  ? "rgba(255, 255, 255, 0.16)"
                  : "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            <StrikethroughSIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Code">
        <span>
          <IconButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            size="small"
            sx={{
              color: editor.isActive("code") ? "#FFFFFF" : "#A1A1AA",
              backgroundColor: editor.isActive("code")
                ? "rgba(255, 255, 255, 0.12)"
                : "transparent",
              "&:hover": {
                backgroundColor: editor.isActive("code")
                  ? "rgba(255, 255, 255, 0.16)"
                  : "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            <CodeIcon />
          </IconButton>
        </span>
      </Tooltip>

      {/* Lists */}
      <Tooltip title="Bullet List">
        <span>
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={!editor.can().chain().focus().toggleBulletList().run()}
            size="small"
            sx={{
              color: editor.isActive("bulletList") ? "#FFFFFF" : "#A1A1AA",
              backgroundColor: editor.isActive("bulletList")
                ? "rgba(255, 255, 255, 0.12)"
                : "transparent",
              "&:hover": {
                backgroundColor: editor.isActive("bulletList")
                  ? "rgba(255, 255, 255, 0.16)"
                  : "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            <FormatListBulletedIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Ordered List">
        <span>
          <IconButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={!editor.can().chain().focus().toggleOrderedList().run()}
            size="small"
            sx={{
              color: editor.isActive("orderedList") ? "#FFFFFF" : "#A1A1AA",
              backgroundColor: editor.isActive("orderedList")
                ? "rgba(255, 255, 255, 0.12)"
                : "transparent",
              "&:hover": {
                backgroundColor: editor.isActive("orderedList")
                  ? "rgba(255, 255, 255, 0.16)"
                  : "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            <FormatListNumberedIcon />
          </IconButton>
        </span>
      </Tooltip>

      {/* Code block */}
      <Tooltip title="Code Block">
        <span>
          <IconButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
            size="small"
            sx={{
              color: editor.isActive("codeBlock") ? "#FFFFFF" : "#A1A1AA",
              backgroundColor: editor.isActive("codeBlock")
                ? "rgba(255, 255, 255, 0.12)"
                : "transparent",
              "&:hover": {
                backgroundColor: editor.isActive("codeBlock")
                  ? "rgba(255, 255, 255, 0.16)"
                  : "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            <DataArrayIcon />
          </IconButton>
        </span>
      </Tooltip>

      {/* Blockquote */}
      <Tooltip title="Blockquote">
        <span>
          <IconButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={!editor.can().chain().focus().toggleBlockquote().run()}
            size="small"
            sx={{
              color: editor.isActive("blockquote") ? "#FFFFFF" : "#A1A1AA",
              backgroundColor: editor.isActive("blockquote")
                ? "rgba(255, 255, 255, 0.12)"
                : "transparent",
              "&:hover": {
                backgroundColor: editor.isActive("blockquote")
                  ? "rgba(255, 255, 255, 0.16)"
                  : "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            <FormatQuoteIcon />
          </IconButton>
        </span>
      </Tooltip>

      {/* Horizontal rule */}
      <Tooltip title="Horizontal Rule">
        <IconButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          size="small"
          sx={{
            color: "#A1A1AA",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          <HorizontalRuleIcon />
        </IconButton>
      </Tooltip>

      {/* Image upload */}
      <Tooltip title="Upload Image">
        <IconButton
          component="label"
          size="small"
          sx={{
            color: "#A1A1AA",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          <ImageIcon />
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const customColors = [
  "#000000",
  "#fafafa",
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFEB3B",
  "#FFC107",
  "#FF9800",
  "#FF5722",
];

export default TipTapMenuBar;
