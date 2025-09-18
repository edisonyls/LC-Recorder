import { axiosInstance } from "../config/axiosConfig";
import { useNotebook } from "../context/notebookContext";
import { actionTypes } from "../reducer/notebookActions";

export const NotebookHooks = () => {
  const { dispatch } = useNotebook();

  const fetchNotebooks = async () => {
    dispatch({ type: actionTypes.PROCESS_START });
    try {
      const response = await axiosInstance.get("notebook");
      dispatch({
        type: actionTypes.FETCH_NOTEBOOKS_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.PROCESS_FAILURE,
        error: error,
      });
      console.error("Failed to fetch notebooks: ", error);
    }
  };

  const addNotebook = async (name) => {
    dispatch({ type: actionTypes.PROCESS_START });
    try {
      const response = await axiosInstance.post("notebook", {
        name,
        contentTree: [],
      });
      dispatch({
        type: actionTypes.ADD_NOTEBOOK_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.PROCESS_FAILURE,
        error: error,
      });
      console.error("Failed to add a new notebook: ", error);
    }
  };

  const renameNotebook = async (id, newName) => {
    dispatch({ type: actionTypes.PROCESS_START });
    try {
      const response = await axiosInstance.patch(`notebook/${id}`, {
        name: newName,
      });
      dispatch({
        type: actionTypes.UPDATE_NOTEBOOK_NAME_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({ type: actionTypes.PROCESS_FAILURE, error: error });
      console.error("Failed to rename: ", error);
    }
  };

  const deleteNotebook = async (id) => {
    dispatch({ type: actionTypes.PROCESS_START });
    try {
      const response = await axiosInstance.delete(`notebook/${id}`);
      dispatch({
        type: actionTypes.DELETE_NOTEBOOK,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({ type: actionTypes.PROCESS_FAILURE, error: error });
      console.error("Failed to delete the notebook: ", error);
    }
  };

  return {
    fetchNotebooks,
    addNotebook,
    renameNotebook,
    deleteNotebook,
  };
};
