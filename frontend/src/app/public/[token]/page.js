"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import VerifiedIcon from "@mui/icons-material/Verified";
import { accessPublicLink } from "@/services/share.api";
import FilePreview from "@/components/dashboard/FilePreview";
import toast from "react-hot-toast";

export default function PublicLinkPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token;

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleAccessClick = async () => {
    if (!token) {
      setError("Invalid link");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await accessPublicLink(token, password || null);

      if (result.success) {
        setAccessGranted(true);
        setFileData(result.data);
        toast.success("Access granted!");
      } else {
        setError(result.message || "Access denied");
        toast.error(result.message || "Access denied");
      }
    } catch (err) {
      console.error("Access error:", err);
      const errorMsg = err.response?.data?.message || "Failed to access link";

      if (err.response?.status === 404) {
        setError("Link not found or expired");
      } else if (err.response?.status === 410) {
        setError("This link has expired");
      } else if (err.response?.status === 401) {
        setError(errorMsg);
      } else {
        setError(errorMsg);
      }

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleAccessClick();
    }
  };

  if (!token) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Card sx={{ p: 4, textAlign: "center" }}>
            <Typography color="error">Invalid link</Typography>
          </Card>
        </Box>
      </Container>
    );
  }

  if (accessGranted && fileData) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            py: 4,
          }}
        >
          <Card sx={{ width: "100%", p: 3 }}>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <VerifiedIcon sx={{ color: "#4caf50", fontSize: 32 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Access Granted
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Resource Type: {fileData.resourceType}
                </Typography>
              </Box>
            </Box>

            {/* File Preview Section */}
            <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Shared Content ({fileData.role})
              </Typography>

              {fileData.resourceType === "file" && (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setPreviewOpen(true)}
                  sx={{
                    backgroundColor: "var(--color-primary)",
                    "&:hover": {
                      backgroundColor: "var(--color-primary-hover)",
                    },
                  }}
                >
                  View File
                </Button>
              )}

              {fileData.resourceType === "folder" && (
                <Typography variant="body2" color="textSecondary">
                  This is a shared folder. You can now access its contents.
                </Typography>
              )}
            </Box>

            {/* Additional Info */}
            <Box
              sx={{ mt: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}
            >
              <Typography variant="caption" color="textSecondary">
                <strong>Role:</strong> {fileData.role} access
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ display: "block", mt: 1 }}
              >
                This link was securely verified and access has been granted.
              </Typography>
            </Box>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Card
          sx={{
            width: "100%",
            p: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <LockIcon
              sx={{ fontSize: 48, color: "var(--color-primary)", mb: 1 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              Access Shared Resource
            </Typography>
            <Typography variant="body2" color="textSecondary">
              This resource is password protected
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Password Input */}
          <Box>
            <TextField
              fullWidth
              type="password"
              label="Enter Password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              disabled={loading}
              error={!!error}
              sx={{ mb: 2 }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleAccessClick}
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <LockIcon />
              }
              sx={{
                backgroundColor: "var(--color-primary)",
                "&:hover": {
                  backgroundColor: "var(--color-primary-hover)",
                },
                py: 1.5,
                fontSize: "1rem",
              }}
            >
              {loading ? "Verifying..." : "Access Resource"}
            </Button>
          </Box>

          {/* Footer */}
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ display: "block", textAlign: "center", mt: 3 }}
          >
            This link requires a password for security. Make sure you have the
            correct password from the sender.
          </Typography>
        </Card>
      </Box>
    </Container>
  );
}
