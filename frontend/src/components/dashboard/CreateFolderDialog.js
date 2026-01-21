"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useCreateFolder } from "@/hooks/useCreateFolder";

export default function CreateFolderDialog({
  open,
  onClose,
  parentId,
  onSuccess,
}) {
  const [folderName, setFolderName] = useState("");
  const { createFolder, creating } = useCreateFolder();

  const handleCreate = async () => {
    const success = await createFolder(folderName, parentId);
    if (success) {
      setFolderName("");
      onSuccess?.();
      onClose();
    }
  };

  const handleClose = () => {
    if (!creating) {
      setFolderName("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Folder</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Folder Name"
          type="text"
          fullWidth
          variant="outlined"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          disabled={creating}
          placeholder="e.g., My Documents"
          sx={{ mt: 2 }}
          onKeyPress={(e) => {
            if (e.key === "Enter" && folderName.trim()) {
              handleCreate();
            }
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={creating}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={!folderName.trim() || creating}
        >
          {creating ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
