export const parseTipTapContent = (content) => {
  if (!content) {
    return null;
  }

  if (typeof content === "object") {
    return content;
  }

  if (typeof content === "string") {
    try {
      return JSON.parse(content);
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
