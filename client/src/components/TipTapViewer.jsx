import React, { useState, useEffect } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { parseTipTapContent } from "../utils/tipTapContentParser";
import { axiosInstance } from "../config/axiosConfig";

// Component to handle authenticated image loading
const AuthenticatedImage = ({
  imageId,
  questionId,
  fetchAuthenticatedImage,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const blobUrl = await fetchAuthenticatedImage(imageId);
        if (blobUrl) {
          setImageSrc(blobUrl);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to load image:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [imageId, questionId, fetchAuthenticatedImage]);

  if (loading) {
    return (
      <div
        style={{
          maxWidth: "100%",
          height: "100px",
          borderRadius: "4px",
          border: "1px solid #333333",
          margin: "8px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          color: "#666",
        }}
      >
        Loading image...
      </div>
    );
  }

  if (error || !imageSrc) {
    return (
      <div
        style={{
          maxWidth: "100%",
          height: "50px",
          borderRadius: "4px",
          border: "1px solid #ff0000",
          margin: "8px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffe6e6",
          color: "#ff0000",
        }}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt="Solution visual"
      style={{
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
      }}
    />
  );
};

// Global cache shared across all TipTapViewer instances
const globalImageCache = new Map();

const TipTapViewer = ({ content, title, solutionId, questionId }) => {
  const fetchAuthenticatedImage = async (imageId) => {
    const cacheKey = `${questionId}-${imageId}`;

    if (globalImageCache.has(cacheKey)) {
      const cachedUrl = globalImageCache.get(cacheKey);
      return cachedUrl;
    }

    try {
      const response = await axiosInstance.get(
        `/question/image/${questionId}/${imageId}`,
        {
          responseType: "blob",
        }
      );
      const blob = response.data;
      const blobUrl = URL.createObjectURL(blob);

      // Store in global cache
      globalImageCache.set(cacheKey, blobUrl);
      return blobUrl;
    } catch (error) {
      console.error(`Failed to fetch image ${imageId}:`, error);
      return null;
    }
  };

  useEffect(() => {
    return () => {
      // TODO: implement a more sophisticated cleanup strategy
    };
  }, []);

  const renderContent = (node) => {
    if (!node || typeof node !== "object") return null;

    switch (node.type) {
      case "doc":
        return (
          <div>
            {node.content?.map((child, index) => (
              <div key={index}>{renderContent(child)}</div>
            ))}
          </div>
        );

      case "paragraph":
        return (
          <p style={{ margin: "8px 0", lineHeight: 1.75 }}>
            {node.content?.map((child, index) => (
              <span key={index}>{renderContent(child)}</span>
            )) || <br />}
          </p>
        );

      case "heading":
        const HeadingTag = `h${node.attrs?.level || 1}`;
        const headingStyles = {
          1: { fontSize: "2rem", margin: "24px 0 16px 0" },
          2: { fontSize: "1.75rem", margin: "20px 0 12px 0" },
          3: { fontSize: "1.5rem", margin: "16px 0 8px 0" },
          4: { fontSize: "1.25rem", margin: "16px 0 8px 0" },
          5: { fontSize: "1.125rem", margin: "12px 0 6px 0" },
          6: { fontSize: "1rem", margin: "12px 0 6px 0" },
        };

        return React.createElement(
          HeadingTag,
          {
            style: {
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 600,
              color: "#FFFFFF",
              ...headingStyles[node.attrs?.level || 1],
            },
          },
          node.content?.map((child, index) => (
            <span key={index}>{renderContent(child)}</span>
          ))
        );

      case "bulletList":
        return (
          <ul style={{ paddingLeft: "24px", margin: "8px 0" }}>
            {node.content?.map((child, index) => (
              <li key={index}>{renderContent(child)}</li>
            ))}
          </ul>
        );

      case "orderedList":
        return (
          <ol style={{ paddingLeft: "24px", margin: "8px 0" }}>
            {node.content?.map((child, index) => (
              <li key={index}>{renderContent(child)}</li>
            ))}
          </ol>
        );

      case "listItem":
        return (
          <span style={{ margin: "4px 0" }}>
            {node.content?.map((child, index) => (
              <div key={index}>{renderContent(child)}</div>
            ))}
          </span>
        );

      case "blockquote":
        return (
          <blockquote
            style={{
              borderLeft: "4px solid #333333",
              paddingLeft: "16px",
              margin: "8px 0",
              fontStyle: "italic",
              color: "#A1A1AA",
            }}
          >
            {node.content?.map((child, index) => (
              <div key={index}>{renderContent(child)}</div>
            ))}
          </blockquote>
        );

      case "codeBlock":
        return (
          <pre
            style={{
              backgroundColor: "#0A0A0A",
              color: "#FFFFFF",
              padding: "16px",
              borderRadius: "4px",
              border: "1px solid #333333",
              margin: "8px 0",
              overflow: "auto",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.875rem",
            }}
          >
            <code>
              {node.content?.map((child, index) => (
                <span key={index}>{renderContent(child)}</span>
              ))}
            </code>
          </pre>
        );

      case "horizontalRule":
        return (
          <hr
            style={{
              border: "none",
              borderTop: "2px solid #333333",
              margin: "16px 0",
            }}
          />
        );

      case "text":
        let text = node.text || "";
        let element = <span>{text}</span>;

        // Apply text marks (formatting)
        if (node.marks) {
          node.marks.forEach((mark) => {
            switch (mark.type) {
              case "bold":
                element = (
                  <strong style={{ color: "#FFFFFF", fontWeight: 600 }}>
                    {element}
                  </strong>
                );
                break;
              case "italic":
                element = <em style={{ color: "#A1A1AA" }}>{element}</em>;
                break;
              case "strike":
                element = <s>{element}</s>;
                break;
              case "code":
                element = (
                  <code
                    style={{
                      backgroundColor: "#1A1A1A",
                      color: "#A1A1AA",
                      padding: "2px 4px",
                      borderRadius: "4px",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "0.8em",
                      border: "1px solid #333333",
                    }}
                  >
                    {element}
                  </code>
                );
                break;
              case "textStyle":
                if (mark.attrs?.color) {
                  element = (
                    <span style={{ color: mark.attrs.color }}>{element}</span>
                  );
                }
                break;
              default:
                break;
            }
          });
        }

        return element;

      case "image":
        const imageSrc = node.attrs?.src || "";

        if (imageSrc.startsWith("/api/") || imageSrc.startsWith("http")) {
          return (
            <img
              src={imageSrc}
              alt="Solution visual"
              style={{
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
              }}
            />
          );
        } else if (imageSrc && questionId) {
          return (
            <AuthenticatedImage
              imageId={imageSrc}
              questionId={questionId}
              fetchAuthenticatedImage={fetchAuthenticatedImage}
            />
          );
        } else {
          return null;
        }

      default:
        return null;
    }
  };

  const parsedContent = parseTipTapContent(content);

  if (!parsedContent) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        {title && (
          <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
            {title} {solutionId}
          </Typography>
        )}
        <Typography
          variant="body2"
          sx={{
            color: "#A1A1AA",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          No content available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
      {title && (
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          {title} {solutionId}
        </Typography>
      )}
      <Box
        sx={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "0.875rem",
          lineHeight: 1.75,
          color: "#FFFFFF",
          "& p:last-child": {
            marginBottom: 0,
          },
        }}
      >
        {renderContent(parsedContent)}
      </Box>
    </Paper>
  );
};

export default TipTapViewer;
