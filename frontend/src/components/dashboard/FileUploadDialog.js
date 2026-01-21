"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useStorageUsage } from "@/hooks/useStorageUsage";
import toast from "react-hot-toast";

export default function FileUploadDialog({
  open,
  onClose,
  folderId,
  onUploadSuccess,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const { uploadFile, uploading, uploadProgress } = useFileUpload();
  const { storage, refetch: refetchStorage } = useStorageUsage();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      // Check storage limit
      if (storage && !storage.canUpload) {
        toast.error("Storage limit reached. Cannot upload file.");
        return;
      }

      if (storage && file.size > storage.totalBytes - storage.usedBytes) {
        const availableMB = (
          (storage.totalBytes - storage.usedBytes) /
          (1024 * 1024)
        ).toFixed(2);
        const fileMB = (file.size / (1024 * 1024)).toFixed(2);
        toast.error(
          `File size (${fileMB} MB) exceeds available storage (${availableMB} MB available)`,
        );
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check storage limit
      if (storage && !storage.canUpload) {
        toast.error("Storage limit reached. Cannot upload file.");
        return;
      }

      if (storage && file.size > storage.totalBytes - storage.usedBytes) {
        const availableMB = (
          (storage.totalBytes - storage.usedBytes) /
          (1024 * 1024)
        ).toFixed(2);
        const fileMB = (file.size / (1024 * 1024)).toFixed(2);
        toast.error(
          `File size (${fileMB} MB) exceeds available storage (${availableMB} MB available)`,
        );
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    const success = await uploadFile(selectedFile, folderId);
    if (success) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onUploadSuccess?.();
      onClose();
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload File</DialogTitle>

      <DialogContent>
        {storage && !storage.canUpload && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Storage limit reached. You cannot upload files.
          </Alert>
        )}

        {storage && storage.percentage > 80 && storage.canUpload && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Storage running low ({storage.percentage.toFixed(1)}% used)
          </Alert>
        )}
        <Box
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          sx={{
            border: "2px dashed",
            borderColor: dragActive ? "primary.main" : "divider",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            backgroundColor: dragActive ? "action.hover" : "transparent",
            my: 2,
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            disabled={uploading}
          />

          <CloudUploadIcon
            sx={{ fontSize: 48, color: "primary.main", mb: 1 }}
          />
          <Typography variant="h6" gutterBottom>
            Drag & drop your file here
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            or
          </Typography>
          <Button
            variant="outlined"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            sx={{ mt: 1 }}
          >
            Choose File
          </Button>
        </Box>

        {selectedFile && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Selected: {selectedFile.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Box>
        )}

        {uploading && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Uploading... {Math.round(uploadProgress)}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!selectedFile || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
