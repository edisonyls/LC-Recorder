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
