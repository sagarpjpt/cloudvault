"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Stack,
  Divider,
  Grid,
} from "@mui/material";
import { shareResource } from "@/services/share.api";
import toast from "react-hot-toast";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";

const ShareDialog = ({
  open,
  onClose,
  resourceType,
  resourceId,
  resourceName,
  onShareSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("VIEWER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingShares, setPendingShares] = useState([]);

  const handleShare = async () => {
    if (!email.trim()) {
      setError("Please enter an email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await shareResource(
        resourceType,
        resourceId,
        email.toLowerCase(),
        role,
      );

      if (result.success) {
        toast.success(`Shared with ${email}`);
        // Add to pending shares list
        setPendingShares([
          ...pendingShares,
          {
            email: email.toLowerCase(),
            role,
            status: "pending",
          },
        ]);
        setEmail("");
        setRole("VIEWER");
        onShareSuccess?.();
      } else {
        setError(result.message || "Failed to share resource");
      }
    } catch (err) {
      console.error("Share error:", err);
      setError(err.response?.data?.message || "Failed to share resource");
      toast.error("Failed to share resource");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveShare = (index) => {
    const updated = pendingShares.filter((_, i) => i !== index);
    setPendingShares(updated);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleShare();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <PersonAddIcon color="primary" />
          Share {resourceType === "file" ? "File" : "Folder"}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Resource Info */}
          <Box
            sx={{
              p: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Typography variant="caption" color="textSecondary">
              Sharing:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.5 }}>
              {resourceName}
            </Typography>
          </Box>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Share Input Form */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
              Invite People
            </Typography>

            <Grid container spacing={1} sx={{ mb: 2 }}>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  error={!!error && !email}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth size="small">
                  <Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                  >
                    <MenuItem value="VIEWER">Viewer</MenuItem>
                    <MenuItem value="EDITOR">Editor</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Divider */}
          {pendingShares.length > 0 && <Divider sx={{ my: 2 }} />}

          {/* Pending Shares List */}
          {pendingShares.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                Shared With ({pendingShares.length})
              </Typography>

              <Stack spacing={1}>
                {pendingShares.map((share, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1.5,
                      backgroundColor: "#f9f9f9",
                      borderRadius: 1,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {share.email}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                        <Chip
                          label={share.role}
                          size="small"
                          variant="outlined"
                          color={share.role === "EDITOR" ? "error" : "default"}
                        />
                        {share.status === "pending" && (
                          <Chip
                            label="Pending"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemoveShare(index)}
                      color="error"
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Empty State */}
          {pendingShares.length === 0 && email === "" && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ textAlign: "center", py: 2 }}
            >
              No shares yet
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button
          onClick={handleShare}
          variant="contained"
          disabled={!email.trim() || loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Sharing..." : "Share"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;
