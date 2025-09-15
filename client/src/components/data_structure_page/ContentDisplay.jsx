import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { GreyBackgroundButton } from "../generic/GenericButton";
import { axiosInstance } from "../../config/axiosConfig";
import EditorWithMenuBar from "./EditorWithMenuBar";

const fetchImage = async (imageId, nodeId) => {
  try {
    const response = await axiosInstance.get(
      `node/image/${nodeId}/${imageId}`,
      { responseType: "blob" }
    );
    return URL.createObjectURL(response.data);
  } catch (err) {
    console.error("Failed to fetch image", err);
    return "";
  }
};

const jsonToHtml = async (node, nodeId) => {
  if (!node || typeof node !== "object" || !node.type) {
    return "";
  }

  const mapContent = async (content) => {
    if (!content || !Array.isArray(content)) {
      return [];
    }
    const results = await Promise.all(
      content.map((contentNode) => jsonToHtml(contentNode, nodeId))
    );
    // Ensure all results are strings
    return results.map((result) => (typeof result === "string" ? result : ""));
  };

  switch (node.type) {
    case "doc":
      const docContent = await mapContent(node.content);
      return docContent.join("");

    case "paragraph":
      const paragraphContent = await mapContent(node.content);
      return `<p>${paragraphContent.join("")}</p>`;

    case "heading":
      const headingContent = await mapContent(node.content);
      return `<h${node.attrs.level}>${headingContent.join("")}</h${
        node.attrs.level
      }>`;

    case "bulletList":
      const bulletListItems = await mapContent(node.content);
      return `<ul>${bulletListItems.join("")}</ul>`;

    case "orderedList":
      const orderedListItems = await mapContent(node.content);
      return `<ol>${orderedListItems.join("")}</ol>`;

    case "listItem":
      const listItemContent = await mapContent(node.content);
      return `<li>${listItemContent.join("")}</li>`;

    case "blockquote":
      const blockquoteContent = await mapContent(node.content);
      return `<blockquote style="color: #fafafa; border-left: 4px solid #ccc; padding-left: 16px; margin-left: 0; font-style: italic;">${blockquoteContent.join(
        ""
      )}</blockquote>`;

    case "codeBlock":
      const codeBlockContent = node.content
        ? await mapContent(node.content)
        : [node.text || ""];
      return `<pre style="background-color: black; color: #fafafa; padding: 16px; border-radius: 8px; font-family: 'Jet Brain', monospace;"><code>${codeBlockContent.join(
        ""
      )}</code></pre>`;

    case "horizontalRule":
      return `<hr style="border: 0; height: 2px; background-color: #fafafa;" />`;

    case "text":
      let text = node.text;
      if (node.marks) {
        node.marks.forEach((mark) => {
          switch (mark.type) {
            case "bold":
              text = `<strong>${text}</strong>`;
              break;
            case "italic":
              text = `<em>${text}</em>`;
              break;
            case "strike":
              text = `<strike>${text}</strike>`;
              break;
            case "code":
              text = `<code style="background-color: #212121; color: white; padding: 2px 4px; border-radius: 4px; font-family: 'Jet Brain', monospace; font-size: 0.85em;">${text}</code>`;
              break;
            case "textStyle":
              if (mark.attrs && mark.attrs.color) {
                text = `<span style="color: ${mark.attrs.color};">${text}</span>`;
              }
              break;
            default:
              break;
          }
        });
      }
      return text;
    case "image":
      const imageSrc = await fetchImage(node.attrs.src, nodeId);
      return `<img src="${imageSrc}" alt="image" title="image" style="max-width: 100%; width: auto; height: auto; max-height: 250px; object-fit: contain; border-radius: 4px; border: 1px solid #333333; margin: 8px auto; display: block; cursor: pointer"/>`;
    default:
      return "";
  }
};

const ContentDisplay = ({
  selectedStructure,
  selectedNode,
  addClicked,
  setAddClicked,
  content,
}) => {
  const [safeHtml, setSafeHtml] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedNode) return;
    setLoading(true);
    (async () => {
      try {
        const parsedContent = JSON.parse(content);
        const generatedHtml = await jsonToHtml(parsedContent, selectedNode.id);
        setSafeHtml(generatedHtml);
      } catch (error) {
        console.error("Failed to process content", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [content, selectedNode, addClicked]);

  if (!selectedStructure) {
    return <NoSelectionMessage message="Please select a data structure." />;
  } else if (!selectedNode) {
    return <NoSelectionMessage message="Please select notes & extras." />;
  } else if (loading) {
    return <LoadingState name={selectedNode?.name} />;
  } else if (addClicked) {
    return (
      <EditorArea
        onClose={() => setAddClicked(false)}
        selectedNode={selectedNode}
        setAddClicked={setAddClicked}
        selectedStructureId={selectedStructure.id}
        safeHtml={safeHtml}
        content={content}
      />
    );
  } else if (selectedNode.content !== null) {
    return (
      <ContentArea
        safeHtml={safeHtml}
        name={selectedNode?.name}
        setAddClicked={setAddClicked}
      />
    );
  } else {
    return (
      <NoContentMessage
        setAddClicked={setAddClicked}
        name={selectedNode?.name}
      />
    );
  }
};

const NoSelectionMessage = ({ message }) => (
  <Box
    sx={{
      overflowY: "auto",
    }}
  >
    <Typography
      variant="h6"
      sx={{
        color: grey[400],
        display: "flex",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {message}
    </Typography>
  </Box>
);

const LoadingState = ({ name }) => (
  <Box>
    <Typography
      variant="h5"
      sx={{
        color: grey[50],
        width: "100%",
        textAlign: "center",
        mb: 4,
      }}
    >
      {name}
    </Typography>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 200,
        width: "100%",
      }}
    >
      <CircularProgress sx={{ color: grey[50] }} />
      <Typography sx={{ color: grey[50], mt: 2 }}>
        Fetching content...
      </Typography>
    </Box>
  </Box>
);

const EditorArea = ({
  onClose,
  selectedNode,
  setAddClicked,
  selectedStructureId,
  safeHtml,
  content,
}) => (
  <Box>
    <Typography
      variant="h5"
      sx={{
        color: grey[50],
        width: "100%",
        textAlign: "center",
        mb: 4,
      }}
    >
      {selectedNode.name}
    </Typography>
    <Box sx={{ flexGrow: 1, overflow: "auto", marginTop: -3 }}>
      <EditorWithMenuBar
        onClose={onClose}
        selectedNode={selectedNode}
        setAddClicked={setAddClicked}
        selectedStructureId={selectedStructureId}
        safeHtml={safeHtml}
        content={content}
      />
    </Box>
  </Box>
);

const ContentArea = ({ safeHtml, name, setAddClicked }) => (
  <Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        mb: 4,
      }}
    >
      <Box sx={{ flexGrow: 1 }} />

      <Typography
        variant="h5"
        sx={{
          position: "absolute",
          color: grey[50],
          textAlign: "center",
        }}
      >
        {name}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <GreyBackgroundButton
        buttonText="Edit"
        onClick={() => setAddClicked(true)}
      />
    </Box>
    <div
      dangerouslySetInnerHTML={{ __html: safeHtml }}
      style={{ color: grey[50] }}
    />
  </Box>
);

const NoContentMessage = ({ setAddClicked, name }) => (
  <Box>
    <Typography
      variant="h5"
      sx={{
        color: grey[50],
        width: "100%",
        textAlign: "center",
        mb: 4,
      }}
    >
      {name}
    </Typography>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        overflow: "auto",
        minHeight: 300,
        height: "100%",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ color: grey[400], mb: 2, textAlign: "center" }}
      >
        No additional information available.
      </Typography>
      <GreyBackgroundButton
        buttonText="Add Content"
        onClick={() => setAddClicked(true)}
      />
    </Box>
  </Box>
);

export default ContentDisplay;
