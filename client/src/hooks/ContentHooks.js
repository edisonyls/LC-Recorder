import { axiosInstance } from "../config/axiosConfig";
import { useDataStructure } from "../context/dataStructureContext";
import { actionTypes } from "../reducer/dataStructureActions";

export const ContentHooks = () => {
  const { dispatch } = useDataStructure();

  async function convertBlobUrlToFile(blobUrl) {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], "image.jpg", { type: "image/jpeg" });
  }

  const uploadImageToBackend = async (imageFile, nodeId) => {
    const fileData = new FormData();
    fileData.append("image", imageFile);
    fileData.append("nodeId", nodeId);
    try {
      const response = await axiosInstance.post("node/upload-image", fileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.serverMessage === "SUCCESS") {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error while uploading content image: " + error);
    }
  };

  const deleteImage = async (nodeId, imageId) => {
    await axiosInstance.delete(`node/image/${nodeId}/${imageId}`);
  };

  const handleSave = async (
    nodeId,
    stringContent,
    dataStructureId,
    imageSrcs
  ) => {
    dispatch({ type: actionTypes.PROCESS_START });
    try {
      const response = await axiosInstance.patch(`node/content/${nodeId}`, {
        content: stringContent,
      });

      // Efficiently delete images and handle potential errors
      await Promise.all(
        imageSrcs.map((imageId) =>
          deleteImage(nodeId, imageId).catch((error) => {
            console.error(`Failed to delete image ${imageId}:`, error);
            // Optionally handle this error in a more user-friendly way
          })
        )
      );

      dispatch({
        type: actionTypes.UPDATE_CONTENT,
        payload: {
          dataStructureId,
          node: response.data.data,
        },
      });
    } catch (error) {
      dispatch({ type: actionTypes.PROCESS_FAILURE, error: error });
      console.error("Failed to save content: ", error);
      // Optionally, update the UI to inform the user of the failure
    }
  };

  return {
    handleSave,
    convertBlobUrlToFile,
    uploadImageToBackend,
  };
};
