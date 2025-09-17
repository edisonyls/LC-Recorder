import { axiosInstance } from "../config/axiosConfig";
import { useDataStructure } from "../context/dataStructureContext";
import { actionTypes } from "../reducer/dataStructureActions";

export const NodeHooks = () => {
  const { dispatch } = useDataStructure();

  const addNode = async (dataStructureId, name, parentNodeId = null) => {
    dispatch({ type: actionTypes.PROCESS_START });
    try {
      const url = parentNodeId 
        ? `data-structure/${dataStructureId}/node?parentNodeId=${parentNodeId}`
        : `data-structure/${dataStructureId}/node`;
      
      const response = await axiosInstance.post(url, {
        name,
        content: "",
      });
      
      dispatch({
        type: actionTypes.UPDATE_DATA_STRUCTURE_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.PROCESS_FAILURE,
        error: error,
      });
      console.error("Failed to add a new node: ", error);
    }
  };

  const updateNode = async (dataStructureId, nodeId, name, content) => {
    dispatch({ type: actionTypes.PROCESS_START });
    try {
      const response = await axiosInstance.put(`data-structure/${dataStructureId}/node/${nodeId}`, {
        name,
        content,
      });
      dispatch({
        type: actionTypes.UPDATE_DATA_STRUCTURE_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.PROCESS_FAILURE,
        error: error,
      });
      console.error("Failed to update the node: ", error);
    }
  };

  const deleteNode = async (dataStructureId, nodeId) => {
    dispatch({ type: actionTypes.PROCESS_START });
    try {
      const response = await axiosInstance.delete(`data-structure/${dataStructureId}/node/${nodeId}`);
      dispatch({
        type: actionTypes.UPDATE_DATA_STRUCTURE_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.PROCESS_FAILURE,
        error: error,
      });
      console.error("Failed to delete the node: ", error);
    }
  };

  const getNode = async (dataStructureId, nodeId) => {
    try {
      const response = await axiosInstance.get(`data-structure/${dataStructureId}/node/${nodeId}`);
      return response.data.data;
    } catch (error) {
      console.error("Failed to get the node: ", error);
      return null;
    }
  };

  const uploadNodeImage = async (dataStructureId, nodeId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      
      const response = await axiosInstance.post(
        `data-structure/${dataStructureId}/node/${nodeId}/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data; // Returns the imageId
    } catch (error) {
      console.error("Failed to upload image: ", error);
      throw error;
    }
  };

  const deleteNodeImage = async (dataStructureId, nodeId, imageId) => {
    try {
      const response = await axiosInstance.delete(
        `data-structure/${dataStructureId}/node/${nodeId}/image/${imageId}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to delete image: ", error);
      throw error;
    }
  };

  return { addNode, updateNode, deleteNode, getNode, uploadNodeImage, deleteNodeImage };
};
