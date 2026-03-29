import { Avatar, Box, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AccountNavbar from "../components/navbar/AccountNavbar";
import { BlackBackgroundButton } from "../components/generic/GenericButton";
import { Link, useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { grey } from "@mui/material/colors";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useUser } from "../context/userContext";
import { UserHooks } from "../hooks/userHooks/UserHooks";

const SignInPage = () => {
  const [formData, setFormData] = useState({});

  const { state, dispatch } = useUser();
  const { loading, error } = state;
  const { login } = UserHooks();

  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"));

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        // Check if the token is expired
        if (decodedToken.exp > currentTime) {
          toast.success("You are already logged in");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "CLEAR_ERROR" });
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: grey[900],
        color: "white",
      }}
    >
      <AccountNavbar />
      <Box
        sx={{
          my: 4,
          mx: 4,
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          alignItems: "center",
          overflow: "auto",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "black" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ marginBottom: 1 }}>
          Sign in
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{
            mt: 1,
            padding: 5,
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px",
            width: "100%",
            backgroundColor: "black",
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Email Address"
            name="username"
            autoFocus
            variant="outlined"
            onChange={handleChange}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{
              style: { color: "white", borderColor: "white" },
            }}
            sx={{
              marginBottom: 2,
              "& .MuiOutlinedInput-root": {
                backgroundColor: grey[900],
              },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "white",
                },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "white",
                },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={handleChange}
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{
              style: { color: "white", borderColor: "white" },
            }}
            sx={{
              marginBottom: 5,
              "& .MuiOutlinedInput-root": {
                backgroundColor: grey[900],
              },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "white",
                },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "white",
                },
            }}
          />
          {loading ? (
            <BlackBackgroundButton
              disabled={loading}
              buttonText="Loading..."
              type="submit"
              fullWidth
            />
          ) : (
            <BlackBackgroundButton
              buttonText="Sign In"
              type="submit"
              fullWidth
            />
          )}

          <Grid container sx={{ marginTop: 5 }}>
            <Grid item xs>
              <Link to="#" variant="body2" style={{ color: "white" }}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/register" variant="body2" style={{ color: "white" }}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default SignInPage;
