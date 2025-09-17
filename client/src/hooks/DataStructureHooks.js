import { axiosInstance } from "../config/axiosConfig";
import { useDataStructure } from "../context/dataStructureContext";
import { actionTypes } from "../reducer/dataStructureActions";

export const DataStructureHooks = () => {
  const { dispatch } = useDataStructure();

  const fetchDataStructures = async () => {
    dispatch({ type: actionTypes.PROCESS_START });
    try {
      const response = await axiosInstance.get("data-structure");
      dispatch({
        type: actionTypes.FETCH_DATA_STRUCTURES_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.PROCESS_FAILURE,
        error: error,
      });
      console.error("Failed to fetch data structures: ", error);
    }
  };

  const addDataStructure = async (name) => {
    dispatch({ type: actionTypes.PROCESS_START });
    try {
      const response = await axiosInstance.post("data-structure", {
        name,
        contentTree: [],
      });
      dispatch({
        type: actionTypes.ADD_DATA_STRUCTURE_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: actionTypes.PROCESS_FAILURE,
        error: error,
      });
      console.error("Failed to add a new data structure: ", error);
    }
  };

  const renameDataStructure = async (id, newName) => {
    dispatch({ type: actionTypes.PROCESS_START });
    try {
      const response = await axiosInstance.patch(`data-structure/${id}`, {
        name: newName,
      });
      dispatch({
        type: actionTypes.UPDATE_DATA_STRUCTURE_NAME_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({ type: actionTypes.PROCESS_FAILURE, error: error });
      console.error("Failed to rename: ", error);
    }
  };

  const deleteDataStructure = async (id) => {
    dispatch({ type: actionTypes.PROCESS_START });
    try {
      const response = await axiosInstance.delete(`data-structure/${id}`);
      dispatch({
        type: actionTypes.DELETE_DATA_STRUCTURE,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({ type: actionTypes.PROCESS_FAILURE, error: error });
      console.error("Failed to delete the data structure: ", error);
    }
  };

  return {
    fetchDataStructures,
    addDataStructure,
    renameDataStructure,
    deleteDataStructure,
  };
};
