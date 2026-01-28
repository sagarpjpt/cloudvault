"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GetAppIcon from "@mui/icons-material/GetApp";

const FilePreview = ({ open, onClose, fileId, fileName, mimeType }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    if (!open || !fileId) {
      setContent(null);
      setError(null);
      setFileUrl(null);
      return;
    }

    const loadFileContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use axios instance which handles auth automatically
        const response = await api.get(`/files/${fileId}/download`, {
          responseType: "blob",
        });

        const blob = response.data;
        const url = URL.createObjectURL(blob);
        setFileUrl(url);

        if (mimeType && mimeType.startsWith("image/")) {
          setContent({ type: "image", url });
        } else if (mimeType === "application/pdf") {
          setContent({ type: "pdf", url });
        } else if (
          mimeType &&
          (mimeType.startsWith("text/") ||
            mimeType === "application/json" ||
            mimeType === "application/xml")
        ) {
          const text = await blob.text();
          setContent({ type: "text", text });
        } else {
          setError("File type not supported for preview");
        }
      } catch (err) {
        console.error("Preview error:", err);
        setError(err.response?.data?.message || "Failed to load file preview");
      } finally {
        setLoading(false);
      }
    };

    loadFileContent();

    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [open, fileId, mimeType]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    if (!content) return null;

    if (content.type === "image") {
      return (
        <Box sx={{ textAlign: "center", maxHeight: "600px", overflow: "auto" }}>
          <img
            src={content.url}
            alt={fileName}
            style={{
              maxWidth: "100%",
              maxHeight: "600px",
              objectFit: "contain",
            }}
          />
        </Box>
      );
    }

    if (content.type === "pdf") {
      return (
        <Box
          sx={{
            width: "100%",
            height: "600px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <iframe
            src={content.url}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: "4px",
            }}
            title={fileName}
          />
        </Box>
      );
    }

    if (content.type === "text") {
      return (
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            p: 2,
            borderRadius: 1,
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxHeight: "600px",
            overflow: "auto",
            fontSize: "0.875rem",
          }}
        >
          {content.text.slice(0, 10000)}
          {content.text.length > 10000 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              File preview truncated. Showing first 10,000 characters.
            </Alert>
          )}
        </Box>
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {fileName}
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {renderContent()}
      </DialogContent>

      <DialogActions>
        {fileUrl && (
          <Button
            href={fileUrl}
            download={fileName}
            startIcon={<GetAppIcon />}
            variant="contained"
            color="primary"
          >
            Download
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilePreview;
