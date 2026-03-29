import React from "react";
import {
  Typography,
  Box,
  Grid,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Info as InfoIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import GenericTextField from "./generic/GenricTextField";
import UserBadge from "./UserBadge";
import { SmallNarrowButton } from "./generic/GenericButton";

export const ProfileView = ({ user }) => {
  const showUpgradeButton = user?.role === "REGULAR" || user.role === "PREMIUM";
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Avatar
          sx={{
            bgcolor: grey[50],
            color: grey[900],
            width: 90,
            height: 90,
            fontSize: "2rem",
            mb: 2,
          }}
        >
          {user.firstName && user.lastName
            ? user.firstName[0] + user.lastName[0]
            : "??"}
        </Avatar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "medium" }}>
            {user.firstName} {user.lastName}
          </Typography>
          <UserBadge role={user.role} />
        </Box>
        <Typography
          variant="subtitle2"
          sx={{ fontSize: "0.75rem", mb: "1px", color: "#B9F2FF" }}
        >
          {user.role === "REGULAR"
            ? "Free Tier"
            : user.role === "PREMIUM"
            ? "Premium Tier"
            : user.role === "PREPLUS"
            ? "Premium Plus Tier"
            : "Admin"}
        </Typography>
        {showUpgradeButton && <SmallNarrowButton buttonText="Upgrade" />}
        <Typography variant="subtitle1" sx={{ color: grey[400], mt: 1 }}>
          Email: {user.username}
        </Typography>
      </Box>
      <Divider />
      <Grid container spacing={4} sx={{ mt: 3, px: 4 }}>
        <Grid item xs={12} sm={6}>
          <Typography
            gutterBottom
            variant="subtitle2"
            sx={{ color: grey[400] }}
          >
            Sex
          </Typography>
          {displayValueOrPlaceholder(user.sex)}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            gutterBottom
            variant="subtitle2"
            sx={{ color: grey[400] }}
          >
            Mobile Number
          </Typography>
          {displayValueOrPlaceholder(user.mobileNumber)}
        </Grid>
        <Grid item xs={12}>
          <Typography
            gutterBottom
            variant="subtitle2"
            sx={{ color: grey[400] }}
          >
            Personal Info
          </Typography>
          {displayValueOrPlaceholder(
            user.personalInfo,
            "No personal information provided"
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export const ProfileEdit = ({ editedUser, handleChange }) => {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Avatar
          sx={{
            bgcolor: grey[50],
            color: grey[900],
            width: 90,
            height: 90,
            fontSize: "2rem",
            mb: 2,
          }}
        >
          {editedUser.firstName && editedUser.lastName
            ? `${editedUser.firstName[0]}${editedUser.lastName[0]}`
            : "😢"}
        </Avatar>
        <Typography variant="subtitle1" sx={{ color: grey[400], mt: 1 }}>
          Email: {editedUser.username}
        </Typography>
      </Box>
      <Grid container spacing={4} sx={{ px: 4, mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <GenericTextField
            fullWidth
            label="First Name"
            name="firstName"
            value={editedUser.firstName || ""}
            onChange={handleChange}
            inputLabelColor={grey[400]}
            inputColor={grey[50]}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <GenericTextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={editedUser.lastName || ""}
            onChange={handleChange}
            inputLabelColor={grey[400]}
            focusColor={"grey"}
            inputColor={grey[50]}
          />
        </Grid>
      </Grid>
      <Divider />
      <Grid container spacing={4} sx={{ mt: 3, px: 4, mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel style={{ color: grey[400] }}>Sex</InputLabel>
            <Select
              label="Sex"
              name="sex"
              value={editedUser.sex || ""}
              onChange={handleChange}
              IconComponent={() => (
                <ArrowDropDownIcon style={{ color: grey[50] }} />
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: "grey",
                  },
                },
              }}
              sx={{ color: grey[50] }}
            >
              <MenuItem value="Male" sx={{ color: grey[50] }}>
                Male
              </MenuItem>
              <MenuItem value="Female" sx={{ color: grey[50] }}>
                Female
              </MenuItem>
              <MenuItem value="Prefer Not To Say" sx={{ color: grey[50] }}>
                Prefer Not To Say
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <GenericTextField
            fullWidth
            label="Mobile Number"
            name="mobileNumber"
            value={editedUser.mobileNumber || ""}
            onChange={handleChange}
            inputLabelColor={grey[400]}
            inputColor={grey[50]}
          />
        </Grid>
        <Grid item xs={12}>
          <GenericTextField
            fullWidth
            label="Personal Info"
            name="personalInfo"
            multiline
            value={editedUser.personalInfo || ""}
            onChange={handleChange}
            inputLabelColor={grey[400]}
            inputColor={grey[50]}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const displayValueOrPlaceholder = (
  value,
  placeholder = "Information not provided"
) =>
  value ? (
    <Typography
      variant="body2"
      sx={{ display: "flex", alignItems: "center", color: grey[50] }}
    >
      {value}
    </Typography>
  ) : (
    <Typography
      variant="body2"
      color="textSecondary"
      sx={{ display: "flex", alignItems: "center" }}
    >
      <InfoIcon sx={{ mr: 1 }} fontSize="small" />
      {placeholder}
    </Typography>
  );
