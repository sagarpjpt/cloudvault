"use client";

import { useParams, useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { acceptInvite } from "@/services/invite.api";
import { useInviteDetails } from "@/hooks/useInviteDetails";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";
import toast from "react-hot-toast";
import { useState } from "react";

export default function InvitePage() {
  const { token } = useParams();
  const router = useRouter();
  const isAuth = isAuthenticated();
  const authLoading = false; // no async auth check
  const user = isAuth ? { email: "authenticated-user" } : null;

  const { invite, loading, error } = useInviteDetails(token);
  const [accepting, setAccepting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const handleAcceptClick = () => {
    if (!user) {
      // Redirect to register with invite token
      router.push(`/auth/register?invite=${token}`);
      return;
    }
    setConfirmDialog(true);
  };

  const handleConfirmAccept = async () => {
    try {
      setAccepting(true);
      acceptInvite(token);
    } catch (err) {
      toast.error("Failed to accept invite");
      setAccepting(false);
    }
  };

  // Still loading user auth or invite details
  if (authLoading || loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <CircularProgress />
        <p className="text-lg">Loading invite details...</p>
      </div>
    );
  }

  // Error loading invite
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 px-4">
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          <strong>Invalid Invite</strong>
          <p>{error}</p>
        </Alert>
        <Button variant="contained" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  // Invite loaded successfully
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4 px-4">
      <Card sx={{ maxWidth: 500, width: "100%" }}>
        <CardContent sx={{ textAlign: "center", py: 6 }}>
          {/* Icon */}
          <Box sx={{ mb: 3 }}>
            {invite.resourceType === "file" ? (
              <FileIcon sx={{ fontSize: 64, color: "#1976d2" }} />
            ) : (
              <FolderIcon sx={{ fontSize: 64, color: "#ff9800" }} />
            )}
          </Box>

          {/* Title */}
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            You're Invited!
          </Typography>

          {/* Subtitle */}
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
            {invite.invitedBy || "Someone"} has shared a{" "}
            {invite.resourceType === "file" ? "file" : "folder"} with you
          </Typography>

          {/* Resource Info */}
          <Box
            sx={{
              p: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              mb: 4,
              textAlign: "left",
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="caption" color="textSecondary">
              {invite.resourceType === "file" ? "File" : "Folder"}:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
              {invite.resourceName}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="textSecondary">
                Access Level:
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={invite.role}
                  size="small"
                  color={invite.role === "EDITOR" ? "warning" : "info"}
                  variant="filled"
                />
              </Box>
            </Box>

            {invite.expiresAt && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="textSecondary">
                  Expires:
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {new Date(invite.expiresAt).toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Access Explanation */}
          <Box
            sx={{
              p: 2,
              backgroundColor: "#e3f2fd",
              borderRadius: 1,
              mb: 4,
              textAlign: "left",
              border: "1px solid #90caf9",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
              <CheckCircleIcon
                sx={{ color: "#1976d2", mt: 0.5, flexShrink: 0 }}
              />
              <div>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {invite.role === "VIEWER"
                    ? "View and Download"
                    : "View, Download, and Edit"}
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ display: "block", mt: 0.5 }}
                >
                  {invite.role === "VIEWER"
                    ? "You'll be able to download and view this content"
                    : "You'll have full editing and sharing permissions"}
                </Typography>
              </div>
            </Box>
          </Box>

          {/* User Status */}
          {user ? (
            <Typography variant="body2" color="success.main" sx={{ mb: 4 }}>
              ✓ Logged in as {user.email}
            </Typography>
          ) : (
            <Alert severity="info" sx={{ mb: 4 }}>
              You'll need to sign up to accept this invite
            </Alert>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="outlined"
              onClick={() => router.push("/")}
              disabled={accepting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAcceptClick}
              disabled={accepting}
              sx={{
                backgroundColor: "#4caf50",
                "&:hover": {
                  backgroundColor: "#45a049",
                },
              }}
              startIcon={accepting && <CircularProgress size={20} />}
            >
              {accepting
                ? "Accepting..."
                : user
                  ? "Accept Invite"
                  : "Sign Up & Accept"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Accept Invite</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Accept this invite to access <strong>{invite.resourceName}</strong>{" "}
            with <strong>{invite.role}</strong> access?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)} disabled={accepting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmAccept}
            disabled={accepting}
            startIcon={accepting && <CircularProgress size={20} />}
          >
            {accepting ? "Accepting..." : "Accept"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
