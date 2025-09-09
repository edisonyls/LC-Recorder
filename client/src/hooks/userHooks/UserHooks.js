import { useNavigate } from "react-router-dom";
import { axiosInstance, axiosInstanceNoAuth } from "../../config/axiosConfig";
import { useUser } from "../../context/userContext";
import { userActionTypes } from "../../reducer/userActions";

export const UserHooks = () => {
  const { dispatch } = useUser();

  const navigate = useNavigate();

  const getCurrentUser = async () => {
    dispatch({ type: userActionTypes.PROCESS_START });
    try {
      const res = await axiosInstance.get("user");
      const user = res.data.data;
      dispatch({
        type: userActionTypes.GET_CURRENT_USER,
        payload: { user },
      });
    } catch (error) {
      dispatch({
        type: userActionTypes.PROCESS_FAILURE,
        error: error.message || "Failed to fetch current user",
      });
      console.log(error);
    }
  };

  const reset = () => {
    dispatch({ type: userActionTypes.CLEAR_ERROR });
  };

  const login = async (formData) => {
    dispatch({ type: userActionTypes.PROCESS_START });
    try {
      const response = await axiosInstanceNoAuth.post(
        "auth/authenticate",
        formData
      );
      const data = response.data;
      if (data.status !== 200) {
        dispatch({
          type: userActionTypes.PROCESS_FAILURE,
          error: data.message,
        });
        return;
      }
      const token = data.data;
      localStorage.setItem("user", JSON.stringify(token));
      const userDetailsResponse = await axiosInstance.get("user");
      const user = userDetailsResponse.data.data;
      dispatch({
        type: userActionTypes.SIGN_IN,
        payload: { token, user },
      });
      if (user.role === "REGULAR") {
        navigate("/table");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      dispatch({
        type: userActionTypes.PROCESS_FAILURE,
        error: error.message || "Failed to login",
      });
      console.log("Failed to login: " + error.message);
    }
  };

  const register = async (formData) => {
    dispatch({ type: userActionTypes.PROCESS_START });
    try {
      const response = await axiosInstanceNoAuth.post(
        "auth/register",
        formData
      );
      const data = response.data;

      if (data.status !== 200) {
        dispatch({
          type: userActionTypes.PROCESS_FAILURE,
          error: data.message,
        });
        return;
      }
      const token = data.data;
      localStorage.setItem("user", JSON.stringify(token));
      const userDetailsResponse = await axiosInstance.get("user");
      const user = userDetailsResponse.data.data;
      dispatch({
        type: userActionTypes.REGISTER,
        payload: { token, user },
      });
      navigate("/table");
    } catch (error) {
      dispatch({
        type: userActionTypes.PROCESS_FAILURE,
        error: error.message || "Failed to register",
      });
      console.log("Failed to register: " + error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: userActionTypes.LOGOUT });
  };

  const updateUser = async (id, user) => {
    dispatch({ type: userActionTypes.PROCESS_START });
    try {
      const res = await axiosInstance.put(`user/${id}`, user);
      const updatedUser = res.data.data;
      dispatch({
        type: userActionTypes.UPDATE_USER,
        payload: { updatedUser },
      });
    } catch (error) {
      dispatch({
        type: userActionTypes.PROCESS_FAILURE,
        error: error.message || "Failed to update user details",
      });
      console.log("Failed to update user detail: " + error.message);
    }
  };

  return {
    login,
    register,
    logout,
    getCurrentUser,
    updateUser,
    reset,
  };
};
