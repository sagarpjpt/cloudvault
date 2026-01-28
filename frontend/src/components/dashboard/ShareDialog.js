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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { shareResource, createPublicLink } from "@/services/share.api";
import toast from "react-hot-toast";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import LockIcon from "@mui/icons-material/Lock";

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
  const [publicLinkRole, setPublicLinkRole] = useState("VIEWER");
  const [publicLinkPassword, setPublicLinkPassword] = useState("");
  const [publicLinkExpiryDays, setPublicLinkExpiryDays] = useState("");
  const [creatingPublicLink, setCreatingPublicLink] = useState(false);
  const [publicLinks, setPublicLinks] = useState([]);

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

  const handleCreatePublicLink = async () => {
    setCreatingPublicLink(true);
    setError("");

    try {
      let expiresAt = null;
      if (publicLinkExpiryDays) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + parseInt(publicLinkExpiryDays));
        expiresAt = expiry.toISOString();
      }

      const result = await createPublicLink(
        resourceType,
        resourceId,
        publicLinkRole,
        expiresAt,
        publicLinkPassword || null,
      );

      if (result.success) {
        const fullLink = `${window.location.origin}/public/${result.data.token}`;
        setPublicLinks([
          ...publicLinks,
          {
            token: result.data.token,
            link: fullLink,
            role: publicLinkRole,
            expiresAt: result.data.expiresAt,
            hasPassword: !!publicLinkPassword,
          },
        ]);
        toast.success("Public link created successfully");
        setPublicLinkPassword("");
        setPublicLinkExpiryDays("");
      } else {
        setError(result.message || "Failed to create public link");
      }
    } catch (err) {
      console.error("Public link error:", err);
      setError(err.response?.data?.message || "Failed to create public link");
      toast.error("Failed to create public link");
    } finally {
      setCreatingPublicLink(false);
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
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

          {/* Public Link Section */}
          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <LinkIcon fontSize="small" />
                Public Link
              </Box>
            </Typography>

            {/* Public Link Creation Form */}
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                backgroundColor: "#fafafa",
                borderRadius: 1,
              }}
            >
              <Grid container spacing={1} sx={{ mb: 1.5 }}>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={publicLinkRole}
                      onChange={(e) => setPublicLinkRole(e.target.value)}
                      disabled={creatingPublicLink}
                    >
                      <MenuItem value="VIEWER">Viewer</MenuItem>
                      <MenuItem value="EDITOR">Editor</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    placeholder="Expires (days)"
                    value={publicLinkExpiryDays}
                    onChange={(e) => setPublicLinkExpiryDays(e.target.value)}
                    disabled={creatingPublicLink}
                    inputProps={{ min: 1, max: 365 }}
                  /><span>(days)</span>
                </Grid>
              </Grid>

              <TextField
                fullWidth
                size="small"
                type="password"
                placeholder="Password (optional)"
                value={publicLinkPassword}
                onChange={(e) => setPublicLinkPassword(e.target.value)}
                disabled={creatingPublicLink}
                sx={{ mb: 1.5 }}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleCreatePublicLink}
                disabled={creatingPublicLink}
                startIcon={
                  creatingPublicLink ? (
                    <CircularProgress size={20} />
                  ) : (
                    <LinkIcon />
                  )
                }
                sx={{
                  backgroundColor: "var(--color-primary)",
                  "&:hover": {
                    backgroundColor: "var(--color-primary-hover)",
                  },
                }}
              >
                {creatingPublicLink ? "Creating..." : "Generate Link"}
              </Button>
            </Box>

            {/* Public Links List */}
            {publicLinks.length > 0 && (
              <Box>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 600, mb: 1, display: "block" }}
                >
                  Generated Links ({publicLinks.length})
                </Typography>

                <Stack spacing={1}>
                  {publicLinks.map((link, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 1.5,
                        backgroundColor: "#f9f9f9",
                        borderRadius: 1,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
                          <Chip
                            label={link.role}
                            size="small"
                            variant="outlined"
                            color={link.role === "EDITOR" ? "error" : "default"}
                          />
                          {link.hasPassword && (
                            <Chip
                              icon={<LockIcon />}
                              label="Password"
                              size="small"
                              variant="outlined"
                            />
                          )}
                          {link.expiresAt && (
                            <Chip
                              label={`Expires: ${new Date(link.expiresAt).toLocaleDateString()}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>

                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <TextField
                          fullWidth
                          size="small"
                          value={link.link}
                          disabled
                          sx={{ flex: 1 }}
                        />
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<FileCopyIcon />}
                          onClick={() => handleCopyLink(link.link)}
                        >
                          Copy
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
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
