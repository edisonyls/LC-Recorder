import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../config/axiosConfig";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
  getDefaultTipTapContent,
  parseTipTapContent,
} from "../utils/tipTapContentParser";

export const useQuestionHooks = (question, initialQuestion) => {
  const navigate = useNavigate();

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const isValidData = validateData();
    if (!isValidData) {
      return;
    }

    for (let i = 0; i < question.solutions.length; i++) {
      const file = question.solutions[i].file;
      if (file && file.size > 5 * 1024 * 1024) {
        toast.error(
          `Image in Solution ${
            i + 1
          } exceeds 5MB. Please upload a smaller file.`
        );
        return;
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
      // only update to S3 if contains a file in solution
      if (solution.file) {
        const fileData = new FormData();
        fileData.append("image", solution.file);
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
            return { ...solution, imageId: response.data.data };
          } else {
            console.log("Image upload failed for solution", index);
            return solution;
          }
        } catch (error) {
          console.error(
            "An error occurred during submission for solution",
            index,
            error
          );
          return solution;
        }
      } else {
        return solution;
      }
    });
    try {
      // Wait for all the image upload promises to complete
      const updatedSolutions = await Promise.all(uploadPromises);
      question.solutions = updatedSolutions;
      const submitResult = await submitRestData(question.id);
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
      if (solution.file) {
        const fileData = new FormData();
        fileData.append("image", solution.file);
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
            return { ...solution, imageId: response.data.data };
          } else {
            console.log("Image upload failed for solution", index);
            return solution;
          }
        } catch (error) {
          console.error(
            "An error occurred during submission for solution",
            index,
            error
          );
          return solution;
        }
      } else {
        return solution; // Return the original solution if there's no file to upload
      }
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
          const file = question.solutions[i].file;
          if (file && file.size > 5 * 1024 * 1024) {
            toast.error(
              `Image in Solution ${
                i + 1
              } exceeds 5MB. Please upload a smaller file.`
            );
            throw new Error("Image file too large");
          }
        }

        try {
          const updatedSolutions = await uploadFiles(
            question.solutions,
            question.number
          );
          question.solutions = updatedSolutions;
          const submitResult = await submitRestData(question.id);
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

  const submitRestData = async (id) => {
    const formattedData = {
      ...question,
      dateOfCompletion: question.dateOfCompletion
        ? question.dateOfCompletion.format("YYYY-MM-DD")
        : "",
      timeOfCompletion: formatTime(question.timeOfCompletion),
      solutions: question.solutions.map((solution) => {
        const parsedContent = parseTipTapContent(solution?.content);
        return parsedContent || JSON.stringify(getDefaultTipTapContent());
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
