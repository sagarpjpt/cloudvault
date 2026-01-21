"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const FilePreview = ({ open, onClose, fileId, fileName, mimeType }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !fileId) {
      setContent(null);
      setError(null);
      return;
    }

    const loadFileContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:4000/api/files/${fileId}/download`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load file");
        }

        if (mimeType.startsWith("image/")) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setContent({ type: "image", url });
        } else if (mimeType === "application/pdf") {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setContent({ type: "pdf", url });
        } else if (
          mimeType.startsWith("text/") ||
          mimeType === "application/json"
        ) {
          const text = await response.text();
          setContent({ type: "text", text });
        } else {
          setError("File type not supported for preview");
        }
      } catch (err) {
        console.error("Preview error:", err);
        setError("Failed to load file preview");
      } finally {
        setLoading(false);
      }
    };

    loadFileContent();

    return () => {
      if (content?.url) {
        URL.revokeObjectURL(content.url);
      }
    };
  }, [open, fileId, mimeType]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
        {loading && <CircularProgress />}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && content && (
          <Box sx={{ width: "100%", maxHeight: "70vh", overflow: "auto" }}>
            {content.type === "image" && (
              <Box
                component="img"
                src={content.url}
                alt={fileName}
                sx={{ width: "100%", maxHeight: "70vh", objectFit: "contain" }}
              />
            )}

            {content.type === "pdf" && (
              <iframe
                src={content.url}
                style={{ width: "100%", height: "70vh", border: "none" }}
                title={fileName}
              />
            )}

            {content.type === "text" && (
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  p: 2,
                  borderRadius: 1,
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  maxHeight: "70vh",
                  overflow: "auto",
                  border: "1px solid #e0e0e0",
                }}
              >
                {content.text}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FilePreview;
