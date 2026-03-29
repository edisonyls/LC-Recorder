import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { LightGreyBackgroundButton } from "../generic/GenericButton";

export const ActionDialog = ({
  open,
  onClose,
  actionType,
  notebookName,
  title,
  newName,
  setNewName,
  onSubmit,
  isDelete,
  itemName,
}) => {
  const dialogTitle = title || `${actionType} ${notebookName || ""}`.trim();
  const inputLabel = notebookName ? `Name of ${notebookName}` : "Name";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth={true}
      sx={{
        "& .MuiPaper-root": { backgroundColor: grey[900] },
        "& .MuiTypography-root, & .MuiInputBase-input": {
          color: grey[50],
        },
        "& .MuiInputLabel-root": {
          color: grey[50],
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: grey[600],
          },
          "&:hover fieldset": {
            borderColor: grey[400],
          },
          "&.Mui-focused fieldset": {
            borderColor: grey[300],
          },
        },
      }}
    >
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        {(actionType === "Add" ||
          actionType === "Rename" ||
          (actionType &&
            (actionType.includes("Add") || actionType.includes("Rename")))) && (
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={inputLabel}
            type="text"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            InputLabelProps={{
              style: { color: grey[50] },
            }}
            inputProps={{
              style: { color: grey[50] },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: grey[600],
                },
                "&:hover fieldset": {
                  borderColor: grey[400],
                },
                "&.Mui-focused fieldset": {
                  borderColor: grey[300],
                },
              },
            }}
          />
        )}
        {(actionType === "Delete" ||
          (actionType && actionType.includes("Delete"))) && (
          <Typography>
            {isDelete && itemName
              ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
              : "Caution! All the data will be deleted."}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <LightGreyBackgroundButton onClick={onClose} buttonText="Cancel" />
        <LightGreyBackgroundButton
          onClick={onSubmit}
          buttonText={
            actionType === "Delete" ||
            (actionType && actionType.includes("Delete"))
              ? "Delete"
              : "Save"
          }
        />
      </DialogActions>
    </Dialog>
  );
};

export const ContentDialog = ({
  isOpen,
  onClose,
  title,
  content,
  onConfirm,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": { backgroundColor: grey[900] },
        "& .MuiTypography-root": {
          color: grey[50],
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <LightGreyBackgroundButton onClick={onClose} buttonText="No" />
        <LightGreyBackgroundButton onClick={onConfirm} buttonText="Yes" />
      </DialogActions>
    </Dialog>
  );
};

export const WarningDialog = ({
  dialogOpen,
  onClose,
  onCancel,
  optionNumber,
  title,
  text,
}) => {
  return (
    <Dialog
      open={dialogOpen}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth={true}
      sx={{
        "& .MuiPaper-root": { backgroundColor: grey[900] },
        "& .MuiTypography-root": {
          color: grey[50],
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      {optionNumber === 2 ? (
        <DialogActions>
          <LightGreyBackgroundButton onClick={onCancel} buttonText="Cancel" />
          <LightGreyBackgroundButton onClick={onClose} buttonText="Confirm" />
        </DialogActions>
      ) : (
        <DialogActions>
          <LightGreyBackgroundButton onClick={onClose} buttonText="OK" />
        </DialogActions>
      )}
    </Dialog>
  );
};
