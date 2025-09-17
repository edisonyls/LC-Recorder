import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
} from "@mui/icons-material";

const PasswordValidator = ({ password }) => {
  const isLengthValid = password.length >= 8 && password.length <= 16;
  const containsDigit = /\d/.test(password);
  const containsLetter = /[A-Za-z]/.test(password);
  return (
    <>
      <List dense sx={{ mt: -5 }}>
        <ListItem sx={{ py: 0 }}>
          <ListItemIcon sx={{ minWidth: "30px" }}>
            {isLengthValid ? (
              <CheckCircleOutlineIcon color="success" fontSize="small" />
            ) : (
              <ErrorOutlineIcon color="error" fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary="Password length in between 8 to 16"
            sx={{
              ".MuiListItemText-primary": {
                fontSize: "0.875rem",
                color: "#B9BBB6",
              },
            }}
          />
        </ListItem>
        <ListItem sx={{ py: 0 }}>
          <ListItemIcon sx={{ minWidth: "30px" }}>
            {containsDigit ? (
              <CheckCircleOutlineIcon color="success" fontSize="small" />
            ) : (
              <ErrorOutlineIcon color="error" fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary="Password contains at least one digit"
            sx={{
              ".MuiListItemText-primary": {
                fontSize: "0.875rem",
                color: "#B9BBB6",
              },
            }}
          />
        </ListItem>
        <ListItem sx={{ py: 0 }}>
          <ListItemIcon sx={{ minWidth: "30px" }}>
            {containsLetter ? (
              <CheckCircleOutlineIcon color="success" fontSize="small" />
            ) : (
              <ErrorOutlineIcon color="error" fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary="Password contains at least one letter"
            sx={{
              ".MuiListItemText-primary": {
                fontSize: "0.875rem",
                color: "#B9BBB6",
              },
            }}
          />
        </ListItem>
      </List>
    </>
  );
};

export default PasswordValidator;
