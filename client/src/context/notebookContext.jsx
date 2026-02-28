import React, { createContext, useContext, useReducer } from "react";
import { notebookReducer, initialState } from "../reducer/notebookReducer";

const NotebookContext = createContext();

export const useNotebook = () => useContext(NotebookContext);

export const NotebookProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notebookReducer, initialState);

  return (
    <NotebookContext.Provider value={{ state, dispatch }}>
      {children}
    </NotebookContext.Provider>
  );
};
