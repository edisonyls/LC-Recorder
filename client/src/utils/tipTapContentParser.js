const sanitizeContent = (content) => {
  if (!content || typeof content !== "object") {
    return content;
  }

  if (Array.isArray(content)) {
    return content.map(sanitizeContent);
  }

  const sanitized = { ...content };

  if (sanitized.content) {
    sanitized.content = sanitized.content.map(sanitizeContent);
  }

  if (sanitized.marks) {
    sanitized.marks = sanitized.marks
      .map((mark) => {
        if (mark.type === "strong") {
          return { ...mark, type: "bold" };
        }
        if (mark.type === "em") {
          return { ...mark, type: "italic" };
        }
        return mark;
      })
      .filter((mark) => {
        // Keep only supported marks
        return ["bold", "italic", "strike", "code", "textStyle"].includes(
          mark.type
        );
      });
  }

  return sanitized;
};

export const parseTipTapContent = (content) => {
  if (!content) {
    return null;
  }

  if (typeof content === "object") {
    return sanitizeContent(content);
  }

  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      return sanitizeContent(parsed);
    } catch (error) {
      console.warn("Failed to parse TipTap content:", error);
      return null;
    }
  }

  return null;
};

export const getDefaultTipTapContent = () => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "Write your solution here..." }],
    },
  ],
});

// Helper function to clean up orphaned blob URLs from content loaded from database
export const cleanupBlobUrlsFromDatabaseContent = (content) => {
  if (!content || typeof content !== "object") {
    return content;
  }

  if (Array.isArray(content)) {
    return content.map(cleanupBlobUrlsFromDatabaseContent).filter(Boolean);
  }

  const cleaned = { ...content };

  // Remove orphaned blob URLs from image nodes - these shouldn't exist in database content
  if (cleaned.type === "image" && cleaned.attrs?.src) {
    const src = cleaned.attrs.src;
    if (src.startsWith("blob:")) {
      console.warn(
        `🧹 Removing orphaned blob URL from database content: ${src}`
      );
      return null; // Remove this image node
    }
  }

  // Recursively process content
  if (cleaned.content) {
    cleaned.content = cleaned.content
      .map(cleanupBlobUrlsFromDatabaseContent)
      .filter(Boolean);
  }

  return cleaned;
};

// Helper function to replace blob URLs with proper image references for display
export const processContentForDisplay = (content, questionId) => {
  if (!content || typeof content !== "object") {
    return content;
  }

  if (Array.isArray(content)) {
    return content.map((item) => processContentForDisplay(item, questionId));
  }

  const processed = { ...content };

  // Process image nodes - replace blob URLs with API URLs
  if (processed.type === "image" && processed.attrs?.src) {
    const src = processed.attrs.src;
    if (src.startsWith("blob:")) {
      // For blob URLs, we need to map them to uploaded image IDs
      // This will be handled during the save process
      processed.attrs.src = src;
    } else if (!src.startsWith("http") && !src.startsWith("/api")) {
      // Assume it's an image ID that needs the API path
      processed.attrs.src = `/api/question/image/${questionId}/${src}`;
    }
  }

  // Recursively process content
  if (processed.content) {
    processed.content = processed.content.map((item) =>
      processContentForDisplay(item, questionId)
    );
  }

  return processed;
};
