import { useState } from "react";
import { useCurrentEditor } from "@tiptap/react";
import { GithubPicker } from "react-color";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
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
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { WarningDialog } from "./DataStructureDialogs";
import { ContentHooks } from "../../hooks/ContentHooks";
import DataArrayIcon from "@mui/icons-material/DataArray";

const DataStructureMenuBar = ({
  onClose,
  selectedNode,
  setAddClicked,
  selectedStructureId,
  content,
}) => {
  const { handleSave, convertBlobUrlToFile, uploadImageToBackend } =
    ContentHooks();
  const { editor } = useCurrentEditor();
  const [anchorEl, setAnchorEl] = useState(null);
  const [colorAnchorEl, setColorAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emptyContentOpen, setEmptyContentOpen] = useState(false);

  const open = Boolean(anchorEl);

  // TODO: DELETING THE EXISTING IMAGE AND RE-UPLOADING THE SAME IMAGES TO S3 IS VERY IN-EFFICIENT.
  // TODO: NEED TO IMPLEMENT A MORE SOPHISTICATED STRATEGY FOR HANDLING IMAGES.
  // TODO: CURRENT IMPLEMENTATION IS ONLY FOR DEMONSTRATION PURPOSES AND NOT FOR PRODUCTION.

  const UploadContent = async () => {
    setLoading(true);
    try {
      const htmlContent = editor.getHTML();

      if (htmlContent === "<p></p>") {
        setEmptyContentOpen(true);
        setLoading(false);
        return;
      }

      const doc = new DOMParser().parseFromString(htmlContent, "text/html");
      const images = doc.querySelectorAll("img");
      let updatedContent = htmlContent;

      for (const img of images) {
        const src = img.getAttribute("src");
        if (src && src.startsWith("blob:")) {
          try {
            const file = await convertBlobUrlToFile(src);
            if (file) {
              const imageId = await uploadImageToBackend(
                file,
                selectedStructureId,
                selectedNode.id
              );
              if (imageId) {
                updatedContent = updatedContent.replace(src, imageId);
              }
            }
          } catch (error) {
            console.error("Error processing image:", error);
          }
        }
      }

      await handleSave(
        selectedStructureId,
        selectedNode.id,
        updatedContent,
        content
      );
      setAddClicked(false);
      setLoading(false);
    } catch (error) {
      console.error("Error uploading content:", error);
      setLoading(false);
    }
  };

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
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target.result;
        editor.chain().focus().setImage({ src: imageSrc }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: grey[800],
        p: 1,
        borderBottom: "1px solid #ccc",
      }}
    >
      <WarningDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={() => {
          setDialogOpen(false);
          onClose();
        }}
        title="Discard Changes"
        content="Are you sure you want to discard your changes? This action cannot be undone."
      />

      <WarningDialog
        open={emptyContentOpen}
        onClose={() => setEmptyContentOpen(false)}
        onConfirm={() => setEmptyContentOpen(false)}
        title="Empty Content"
        content="Cannot save empty content. Please add some content before saving."
        showCancelButton={false}
      />

      <Box>
        <Tooltip title="Text Style">
          <IconButton
            onClick={handleMenuClick}
            style={{ color: grey[50] }}
            endIcon={<KeyboardArrowDownIcon />}
          >
            {getCurrentHeadingLevel()}
            <KeyboardArrowDownIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          sx={{
            "& .MuiDialog-paper": { bgcolor: grey[900], color: grey[50] },
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
              sx={{ color: grey[900] }}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>

        <Tooltip title="Text Color">
          <IconButton
            onClick={openColorPicker}
            style={{
              color: editor.getAttributes("textStyle")?.color || grey[900],
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

        <Tooltip title="Bold">
          <IconButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            style={{ color: editor.isActive("bold") ? grey[50] : grey[900] }}
          >
            <FormatBoldIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic">
          <IconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            style={{ color: editor.isActive("italic") ? grey[50] : grey[900] }}
          >
            <FormatItalicIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Strike Through">
          <IconButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            style={{ color: editor.isActive("strike") ? grey[50] : grey[900] }}
          >
            <StrikethroughSIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Inline Code">
          <IconButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            style={{ color: editor.isActive("code") ? grey[50] : grey[900] }}
          >
            <CodeIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Bullet List">
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={!editor.can().chain().focus().toggleBulletList().run()}
            style={{
              color: editor.isActive("bulletList") ? grey[50] : grey[900],
            }}
          >
            <FormatListBulletedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Numbered List">
          <IconButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={!editor.can().chain().focus().toggleOrderedList().run()}
            style={{
              color: editor.isActive("orderedList") ? grey[50] : grey[900],
            }}
          >
            <FormatListNumberedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Code Block">
          <IconButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
            style={{
              color: editor.isActive("codeBlock") ? grey[50] : grey[900],
            }}
          >
            <DataArrayIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Blockquote">
          <IconButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={!editor.can().chain().focus().toggleBlockquote().run()}
            style={{
              color: editor.isActive("blockquote") ? grey[50] : grey[900],
            }}
          >
            <FormatQuoteIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Horizontal Rule">
          <IconButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            style={{ color: grey[50] }}
          >
            <HorizontalRuleIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Upload Image">
          <IconButton component="label" style={{ color: grey[50] }}>
            <ImageIcon />
            <input type="file" hidden onChange={handleImageUpload} />
          </IconButton>
        </Tooltip>
      </Box>
      <Box>
        <Tooltip title="Cancel">
          <IconButton
            onClick={() => {
              setDialogOpen(true);
            }}
            style={{ color: grey[50] }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Save">
          <IconButton
            onClick={UploadContent}
            style={{ color: grey[50] }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} style={{ color: grey[50] }} />
            ) : (
              <SaveIcon />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

const customColors = [
  "#000000", // black
  "#fafafa", // white
  "#F44336", // red
  "#E91E63", // pink
  "#9C27B0", // purple
  "#673AB7", // deep purple
  "#3F51B5", // indigo
  "#2196F3", // blue
  "#03A9F4", // light blue
  "#00BCD4", // cyan
  "#009688", // teal
  "#4CAF50", // green
  "#8BC34A", // light green
  "#CDDC39", // lime
  "#FFEB3B", // yellow
  "#FFC107", // amber
  "#FF9800", // orange
  "#FF5722", // deep orange
];

export default DataStructureMenuBar;
