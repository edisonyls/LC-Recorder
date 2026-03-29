import React, { useState, useEffect } from "react";
import AuthenticatedNavbar from "../components/navbar/AuthenticatedNavbar";
import { Box, Card, CardContent, Container } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ProfileEdit } from "../components/Profile";
import { ProfileView } from "../components/Profile";
import { GreyBackgroundButton } from "../components/generic/GenericButton";
import { toast } from "react-toastify";
import { useUser } from "../context/userContext";
import { UserHooks } from "../hooks/userHooks/UserHooks";
import Footer from "../components/Footer";

const ProfilePage = () => {
  const { state } = useUser();
  const { user } = state;
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const { updateUser, getCurrentUser } = UserHooks();

  useEffect(() => {
    getCurrentUser();
  }, []); // eslint-disable-line

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setEditMode(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const userId = editedUser.id;
    updateUser(userId, editedUser);
    toast.success("Update successfully!");
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <AuthenticatedNavbar />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#121212",
          mt: -4,
        }}
      >
        <Container component="main" maxWidth="md" sx={{ pt: 8, pb: 6, mb: 4 }}>
          <Card raised sx={{ backgroundColor: grey[800], color: grey[50] }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {!editMode ? (
                  <GreyBackgroundButton
                    buttonText="Edit"
                    onClick={handleEdit}
                  />
                ) : (
                  <>
                    <GreyBackgroundButton
                      buttonText="Cancel"
                      onClick={handleCancel}
                    />

                    <GreyBackgroundButton
                      onClick={handleSave}
                      buttonText="Save"
                    />
                  </>
                )}
              </Box>
              {!editMode ? (
                <ProfileView user={user} onEdit={handleEdit} />
              ) : (
                <ProfileEdit
                  editedUser={editedUser}
                  handleChange={handleChange}
                />
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default ProfilePage;
