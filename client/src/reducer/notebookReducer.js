import { actionTypes } from "./notebookActions";

export const initialState = {
  notebooks: [],
  loading: false,
  error: null,
};

export function notebookReducer(state, action) {
  switch (action.type) {
    case actionTypes.PROCESS_START:
      return { ...state, loading: true, error: null };
    case actionTypes.PROCESS_FAILURE:
      return { ...state, loading: false, error: action.error };
    case actionTypes.FETCH_NOTEBOOKS_SUCCESS:
      return { ...state, notebooks: action.payload, loading: false };
    case actionTypes.ADD_NOTEBOOK_SUCCESS:
      return {
        ...state,
        notebooks: [...state.notebooks, action.payload],
        loading: false,
        error: null,
      };
    case actionTypes.UPDATE_NOTEBOOK_NAME_SUCCESS:
      const updatedNotebooks = state.notebooks.map((nb) => {
        if (nb.id === action.payload.id) {
          return { ...nb, name: action.payload.name };
        }
        return nb;
      });
      return {
        ...state,
        notebooks: updatedNotebooks,
        loading: false,
        error: null,
      };
    case actionTypes.UPDATE_NOTEBOOK_SUCCESS:
      const updatedNotebooksForUpdate = state.notebooks.map((nb) => {
        if (nb.id === action.payload.id) {
          return action.payload;
        }
        return nb;
      });
      return {
        ...state,
        notebooks: updatedNotebooksForUpdate,
        loading: false,
        error: null,
      };
    case actionTypes.DELETE_NOTEBOOK:
      return {
        ...state,
        notebooks: state.notebooks.filter((nb) => nb.id !== action.payload.id),
        loading: false,
        error: null,
      };
    default:
      return state;
  }
}
