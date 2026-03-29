import { axiosInstance } from "../config/axiosConfig";
import { useNotebook } from "../context/notebookContext";
import { actionTypes } from "../reducer/notebookActions";

export const NodeHooks = () => {
  const { dispatch } = useNotebook();

  const addNode = async (notebookId, name, parentNodeId = null) => {
    dispatch({ type: actionTypes.PROCESS_START });
    try {
      const url = parentNodeId
        ? `notebook/${notebookId}/node?parentNodeId=${parentNodeId}`
        : `notebook/${notebookId}/node`;

      const response = await axiosInstance.post(url, {
        name,
        content: "",
      });

      dispatch({
        type: actionTypes.UPDATE_NOTEBOOK_SUCCESS,
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

  const updateNode = async (notebookId, nodeId, name, content) => {
    dispatch({ type: actionTypes.PROCESS_START });
    try {
      const response = await axiosInstance.put(
        `notebook/${notebookId}/node/${nodeId}`,
        {
          name,
          content,
        }
      );
      dispatch({
        type: actionTypes.UPDATE_NOTEBOOK_SUCCESS,
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

  const deleteNode = async (notebookId, nodeId) => {
    dispatch({ type: actionTypes.PROCESS_START });
    try {
      const response = await axiosInstance.delete(
        `notebook/${notebookId}/node/${nodeId}`
      );
      dispatch({
        type: actionTypes.UPDATE_NOTEBOOK_SUCCESS,
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

  const getNode = async (notebookId, nodeId) => {
    try {
      const response = await axiosInstance.get(
        `notebook/${notebookId}/node/${nodeId}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to get the node: ", error);
      return null;
    }
  };

  const uploadNodeImage = async (notebookId, nodeId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await axiosInstance.post(
        `notebook/${notebookId}/node/${nodeId}/upload-image`,
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

  const deleteNodeImage = async (notebookId, nodeId, imageId) => {
    try {
      const response = await axiosInstance.delete(
        `notebook/${notebookId}/node/${nodeId}/image/${imageId}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to delete image: ", error);
      throw error;
    }
  };

  return {
    addNode,
    updateNode,
    deleteNode,
    getNode,
    uploadNodeImage,
    deleteNodeImage,
  };
};
