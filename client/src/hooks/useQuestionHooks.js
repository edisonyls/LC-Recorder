import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../config/axiosConfig";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
  getDefaultTipTapContent,
  parseTipTapContent,
} from "../utils/tipTapContentParser";

const extractExistingImageIds = (contentString) => {
  try {
    const content = JSON.parse(contentString);
    const imageIds = [];

    const collectImageIds = (node) => {
      if (!node || typeof node !== "object") return;

      if (Array.isArray(node)) {
        node.forEach(collectImageIds);
        return;
      }

      if (node.type === "image" && node.attrs?.src) {
        const src = node.attrs.src;

        if (
          src &&
          !src.startsWith("blob:") &&
          !src.startsWith("http") &&
          !src.startsWith("/api")
        ) {
          imageIds.push(src);
        }
      }

      if (node.content) {
        node.content.forEach(collectImageIds);
      }
    };

    collectImageIds(content);
    return imageIds;
  } catch (error) {
    console.error("Error extracting existing image IDs:", error);
    return [];
  }
};

const replaceContentBlobsWithImageIds = async (
  contentString,
  imageMap,
  newImageIds,
  existingImageIds = []
) => {
  try {
    const content = JSON.parse(contentString);

    const blobToImageId = new Map();

    const collectBlobUrls = (node, blobUrls = []) => {
      if (!node || typeof node !== "object") return blobUrls;

      if (Array.isArray(node)) {
        node.forEach((item) => collectBlobUrls(item, blobUrls));
        return blobUrls;
      }

      if (node.type === "image" && node.attrs?.src) {
        const src = node.attrs.src;
        if (src.startsWith("blob:")) {
          blobUrls.push(src);
        }
      }

      if (node.content) {
        node.content.forEach((item) => collectBlobUrls(item, blobUrls));
      }

      return blobUrls;
    };

    const blobUrls = collectBlobUrls(content);

    const newBlobUrls = [];
    const existingBlobUrls = [];

    blobUrls.forEach((blobUrl) => {
      if (imageMap.has(blobUrl)) {
        newBlobUrls.push(blobUrl);
      } else {
        existingBlobUrls.push(blobUrl);
      }
    });

    // Map new blob URLs to new image IDs
    newBlobUrls.forEach((blobUrl, index) => {
      if (index < newImageIds.length) {
        blobToImageId.set(blobUrl, newImageIds[index]);
      }
    });

    // Map existing blob URLs to existing image IDs
    existingBlobUrls.forEach((blobUrl, index) => {
      if (index < existingImageIds.length) {
        blobToImageId.set(blobUrl, existingImageIds[index]);
      }
    });

    const replaceInNode = (node) => {
      if (!node || typeof node !== "object") return node;

      if (Array.isArray(node)) {
        return node.map(replaceInNode).filter(Boolean);
      }

      const newNode = { ...node };

      // Replace blob URLs in image nodes
      if (newNode.type === "image" && newNode.attrs?.src) {
        const src = newNode.attrs.src;
        if (src.startsWith("blob:")) {
          if (blobToImageId.has(src)) {
            const imageId = blobToImageId.get(src);
            newNode.attrs.src = imageId;
          }
        }
      }
      if (newNode.content) {
        newNode.content = newNode.content.map(replaceInNode).filter(Boolean); // Remove null nodes
      }

      return newNode;
    };

    const updatedContent = replaceInNode(content);

    return JSON.stringify(updatedContent);
  } catch (error) {
    console.error("Error processing content for blob replacement:", error);
    return contentString;
  }
};

export const useQuestionHooks = (question, initialQuestion) => {
  const navigate = useNavigate();

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const isValidData = validateData();
    if (!isValidData) {
      return;
    }

    for (let i = 0; i < question.solutions.length; i++) {
      const solution = question.solutions[i];
      const files = solution.files || [];

      for (let j = 0; j < files.length; j++) {
        const file = files[j];
        if (file && file.size > 5 * 1024 * 1024) {
          toast.error(
            `Image ${j + 1} in Solution ${
              i + 1
            } exceeds 5MB. Please upload a smaller file.`
          );
          return;
        }
      }
    }

    const originalImageIds = initialQuestion.solutions.map(
      (solution) => solution.imageId
    );
    const updatedImageIds = question.solutions.map(
      (solution) => solution.imageId
    );

    const imagesToBeDeleted = originalImageIds.filter(
      (id) => !updatedImageIds.includes(id)
    );

    // delete all the images that have been modified and have been uploaded to S3 before
    const deletePromises = imagesToBeDeleted.map((imageId) => {
      return axiosInstance
        .delete(`question/image/${question.id}/${imageId}`)
        .then((response) => console.log(`Deleted imageId: ${imageId}`))
        .catch((error) =>
          console.error(`Error deleting imageId: ${imageId}`, error)
        );
    });

    if (imagesToBeDeleted.length > 0) {
      await Promise.all(deletePromises);
    }

    const uploadPromises = question.solutions.map(async (solution, index) => {
      const files = solution.files || [];
      const imageIds = [];

      // Upload all files for this solution
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const fileData = new FormData();
        fileData.append("image", file);
        fileData.append("questionNumber", question.number);

        try {
          const response = await axiosInstance.post(
            "question/upload-image",
            fileData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.data.serverMessage === "SUCCESS") {
            const imageId = response.data.data;
            imageIds.push(imageId);
          }
        } catch (error) {
          console.error(
            `An error occurred during image upload ${i + 1} for solution`,
            index,
            error
          );
        }
      }

      const originalSolution = initialQuestion?.solutions?.[index];
      const existingImageIds = originalSolution
        ? extractExistingImageIds(originalSolution)
        : [];

      const updatedContent = await replaceContentBlobsWithImageIds(
        solution.content,
        solution.imageMap || new Map(),
        imageIds,
        existingImageIds
      );

      return {
        ...solution,
        imageIds,
        uploadedCount: imageIds.length,
        content: updatedContent,
      };
    });
    try {
      // Wait for all the image upload promises to complete
      const updatedSolutions = await Promise.all(uploadPromises);

      const submitResult = await submitRestData(question.id, updatedSolutions);
      if (submitResult) {
        navigate(-1);
        toast.success("Question updated successfully!");
      } else {
        toast.error("An error occurred during form submission.");
      }
    } catch (error) {
      console.error("An error occurred during image uploads", error);
    }
  };

  const uploadFiles = async (solutions, questionNumber) => {
    const uploadPromises = solutions.map(async (solution, index) => {
      const files = solution.files || [];
      const imageIds = [];

      // Upload all files for this solution
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const fileData = new FormData();
        fileData.append("image", file);
        fileData.append("questionNumber", questionNumber);

        try {
          const response = await axiosInstance.post(
            "question/upload-image",
            fileData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.data.serverMessage === "SUCCESS") {
            const imageId = response.data.data;
            imageIds.push(imageId);
          }
        } catch (error) {
          console.error(
            `An error occurred during image upload ${i + 1} for solution`,
            index,
            error
          );
        }
      }

      // Extract existing image IDs from the original solution content
      const originalSolution = initialQuestion?.solutions?.[index];
      const existingImageIds = originalSolution
        ? extractExistingImageIds(originalSolution)
        : [];

      const updatedContent = await replaceContentBlobsWithImageIds(
        solution.content,
        solution.imageMap || new Map(),
        imageIds,
        existingImageIds
      );

      return {
        ...solution,
        imageIds,
        uploadedCount: imageIds.length,
        content: updatedContent,
      };
    });

    return await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    toast.promise(
      (async () => {
        const isValidData = validateData();
        if (!isValidData) {
          throw new Error("Invalid data");
        }

        for (let i = 0; i < question.solutions.length; i++) {
          const solution = question.solutions[i];
          const files = solution.files || [];

          for (let j = 0; j < files.length; j++) {
            const file = files[j];
            if (file && file.size > 5 * 1024 * 1024) {
              toast.error(
                `Image ${j + 1} in Solution ${
                  i + 1
                } exceeds 5MB. Please upload a smaller file.`
              );
              throw new Error("Image file too large");
            }
          }
        }

        try {
          const updatedSolutions = await uploadFiles(
            question.solutions,
            question.number
          );

          const submitResult = await submitRestData(
            question.id,
            updatedSolutions
          );
          if (submitResult) {
            navigate("/table");
          } else {
            toast.error("An error occurred during form submission.");
          }
        } catch (error) {
          console.error("An error occurred during the process", error);
        }
      })(),
      {
        pending: "Uploading New Question",
        success: "Created Successfully 👌",
        error: "Upload Failed 🤯",
      }
    );
  };

  const validateData = () => {
    if (question.dateOfCompletion === null) {
      alert("Date of Completion is required.");
      return false;
    } else if (dayjs(question.dateOfCompletion).isAfter(dayjs())) {
      alert("Date of Completion cannot be in the future.");
      return false;
    } else if (question.timeOfCompletion === null) {
      alert("Time of Completion is required.");
      return false;
    } else if (question.success === "" || question.success === null) {
      toast.error("Did you solve this LeetCode problem?");
      return false;
    }
    return true;
  };

  const submitRestData = async (id, processedSolutions = null) => {
    const solutionsToUse = processedSolutions || question.solutions;
    const formattedData = {
      ...question,
      dateOfCompletion: question.dateOfCompletion
        ? question.dateOfCompletion.format("YYYY-MM-DD")
        : "",
      timeOfCompletion: formatTime(question.timeOfCompletion),
      solutions: solutionsToUse.map((solution) => {
        const parsedContent = parseTipTapContent(solution?.content);
        return parsedContent
          ? JSON.stringify(parsedContent)
          : JSON.stringify(getDefaultTipTapContent());
      }),
    };
    if (formattedData.success === true) {
      formattedData.reasonOfFail = "";
    }
    try {
      let response = null;
      if (id) {
        response = await axiosInstance.put(`question/${id}`, formattedData);
      } else {
        response = await axiosInstance.post("question", formattedData);
      }
      if (response && response.data.serverMessage === "SUCCESS") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("An error occurred during form submission", error);
      return false;
    }
  };

  const formatTime = (time) => {
    const [minutes, seconds] = time.split(":").map(Number);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return { handleSubmit, handleUpdateSubmit };
};
