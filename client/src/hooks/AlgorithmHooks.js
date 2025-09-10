import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../config/axiosConfig";
import { useAlgorithm } from "../context/AlgorithmContext";
import { algorithmActionTypes } from "../reducer/algoirthmActions";
import { toast } from "react-toastify";

export const AlgorithmHooks = () => {
  const { dispatch } = useAlgorithm();
  const navigate = useNavigate();

  const fetchAlgorithms = async () => {
    dispatch({ type: algorithmActionTypes.PROCESS_START });
    try {
      const response = await axiosInstance.get("algorithm");
      dispatch({
        type: algorithmActionTypes.FETCH_ALGORITHMS_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: algorithmActionTypes.PROCESS_FAILURE,
        error: error,
      });
      console.error("Failed to fetch algorithm: ", error);
    }
  };

  const submitAlgorithm = async (algorithmData) => {
    dispatch({ type: algorithmActionTypes.PROCESS_START });
    const { sections, title, tag, summary } = algorithmData;

    let imageId = null;

    // Transform "Complexity" section into separate ones
    const transformedSections = handleComplexitySection(sections);

    // Filter out sections with empty content
    const filteredSections = handleEmptySections(transformedSections);

    const uploadPromises = filteredSections.map(async (section, index) => {
      if (section.name === "Visual Representation") {
        const result = await uploadImage(section, index);
        if (result.content) {
          imageId = result.content;
        }
        return result;
      } else {
        return section; // Return the original section if there's no file to upload
      }
    });

    try {
      const updatedSections = await Promise.all(uploadPromises);
      const finalData = {
        title,
        tag,
        summary,
        sections: updatedSections,
      };

      if (imageId) {
        finalData.imageId = imageId;
      }

      await submitAlgorithmData(finalData);
    } catch (error) {
      console.error(
        "Failed during the final preparation of submission data",
        error
      );
    }
  };

  // TODO: UPDATE THE TITLE LEAD TO UNABLE TO FIND THE ALGORITHM IMAGE!
  const updateAlgorithm = async (algorithmId, algorithmData, imageChanged) => {
    dispatch({ type: algorithmActionTypes.PROCESS_START });
    const { title, tag, summary, sections } = algorithmData;
    const transformedSections = handleComplexitySection(sections);
    let imageId = null;
    const filteredSections = handleEmptySections(transformedSections);
    const uploadPromises = filteredSections.map(async (section, index) => {
      // the reason we need to filter out id is for maintaining the order of the section
      const { id, ...sectionWithoutId } = section;

      if (section.name === "Visual Representation" && imageChanged) {
        const result = await uploadImage(section, index);
        if (result.content) {
          imageId = result.content;
        }
        return result;
      } else {
        return sectionWithoutId; // Return the original section if there's no file to upload
      }
    });
    try {
      const updatedSections = await Promise.all(uploadPromises);
      const finalData = {
        title,
        tag,
        summary,
        sections: updatedSections,
      };

      if (imageId) {
        finalData.imageId = imageId;
      }

      await updateAlgorithmData(algorithmId, finalData);
    } catch (error) {
      console.error(
        "Failed during the final preparation of submission data",
        error
      );
    }
  };

  const deleteAlgorithm = async (id) => {
    dispatch({ type: algorithmActionTypes.PROCESS_START });
    try {
      const response = await axiosInstance.delete(`algorithm/${id}`);
      if (response.data.status === 200) {
        dispatch({
          type: algorithmActionTypes.DELETE_ALGORITHM,
          payload: id,
        });
        toast.success(response.data.message);
      } else {
        throw new Error("Failed to delete algorithm");
      }
    } catch (error) {
      dispatch({
        type: algorithmActionTypes.PROCESS_FAILURE,
        error: error.toString(),
      });
      toast.error("Failed to delete algorithm.");
    }
  };

  const handleComplexitySection = (sections) => {
    return sections.flatMap((section) => {
      if (section.name === "Complexity" && section.content) {
        return [
          { name: "Time Complexity", content: section.content.time || "" },
          { name: "Space Complexity", content: section.content.space || "" },
        ];
      }
      return section;
    });
  };

  const handleEmptySections = (sections) => {
    return sections.filter((section) => {
      if (typeof section.content === "string") {
        return section.content.trim() !== "";
      } else if (typeof section.content === "object") {
        return Object.values(section.content).some(
          (value) => value && value.trim() !== ""
        );
      }
      return false;
    });
  };

  const uploadImage = async (section, index) => {
    const fileData = new FormData();
    fileData.append("image", section.file);
    try {
      const response = await axiosInstance.post(
        "algorithm/upload-image",
        fileData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.serverMessage === "SUCCESS") {
        return { ...section, content: response.data.data };
      } else {
        console.error("Image upload failed.");
        return section;
      }
    } catch (error) {
      console.error(
        "An error occurred during submission for an image",
        index,
        error
      );
      return section;
    }
  };

  const submitAlgorithmData = async (finalData) => {
    try {
      const response = await axiosInstance.post("algorithm", finalData);
      dispatch({
        type: algorithmActionTypes.ADD_ALGORITHM_SUCCESS,
        payload: response.data.data,
      });
      toast.success("New algorithm saved successfully!", {
        autoClose: 2000,
      });
      navigate("/algorithm");
    } catch (error) {
      dispatch({
        type: algorithmActionTypes.PROCESS_FAILURE,
        error: error,
      });
      toast.error("Failed to save algorithm. Contact admin.");
      console.error("Error while saving a new algorithm", error);
    }
  };

  const updateAlgorithmData = async (id, finalData) => {
    try {
      const response = await axiosInstance.put(`algorithm/${id}`, finalData);
      dispatch({
        type: algorithmActionTypes.UPDATE_ALGORITHM,
        payload: response.data.data,
      });
      toast.success("Update successfully!", {
        autoClose: 2000,
      });
      navigate("/algorithm");
    } catch (error) {
      dispatch({
        type: algorithmActionTypes.PROCESS_FAILURE,
        error: error,
      });
      toast.error("Failed to update algorithm. Contact admin.");
      console.error("Error while updating a new algorithm", error);
    }
  };

  return {
    fetchAlgorithms,
    submitAlgorithm,
    deleteAlgorithm,
    updateAlgorithm,
  };
};
