"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

export const RenameDialog = ({
  open,
  title,
  currentName,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  const [newName, setNewName] = useState(currentName);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleConfirm = () => {
    if (!newName.trim()) {
      return;
    }
    onConfirm(newName.trim());
    setNewName(currentName);
  };

  const handleCancel = () => {
    setNewName(currentName);
    onCancel();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          autoFocus
          fullWidth
          value={newName}
          onChange={handleNameChange}
          placeholder="Enter new name"
          disabled={isLoading}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !isLoading) {
              handleConfirm();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={
            isLoading || !newName.trim() || newName.trim() === currentName
          }
        >
          {isLoading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  );
};
