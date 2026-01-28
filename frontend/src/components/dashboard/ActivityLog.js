"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GetAppIcon from "@mui/icons-material/GetApp";
import RestoreIcon from "@mui/icons-material/Restore";
import IosShareIcon from "@mui/icons-material/IosShare";

const ACTION_ICONS = {
  upload: <CloudUploadIcon fontSize="small" />,
  rename: <EditIcon fontSize="small" />,
  delete: <DeleteIcon fontSize="small" />,
  download: <GetAppIcon fontSize="small" />,
  restore: <RestoreIcon fontSize="small" />,
  share: <IosShareIcon fontSize="small" />,
  move: <IosShareIcon fontSize="small" />,
};

const ACTION_COLORS = {
  upload: "success",
  rename: "info",
  delete: "error",
  download: "default",
  restore: "warning",
  share: "primary",
  move: "secondary",
};

export default function ActivityLog({
  resourceType,
  resourceId,
  open,
  onClose,
}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && resourceType && resourceId) {
      fetchActivities();
    }
  }, [open, resourceType, resourceId]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(
        `/activities/${resourceType}/${resourceId}`,
      );
      setActivities(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch activity log");
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  const getActivityDescription = (activity) => {
    const context = activity.context || {};
    const actorName = activity.actor_name || activity.actor_email || "System";

    switch (activity.action) {
      case "upload":
        return `${actorName} uploaded ${context.fileName || "file"}`;
      case "rename":
        return `${actorName} renamed from "${context.oldName}" to "${context.newName}"`;
      case "delete":
        return `${actorName} deleted ${context.fileName || "item"}`;
      case "restore":
        return `${actorName} restored to version ${context.rollbackToVersion}`;
      case "download":
        return `${actorName} downloaded ${context.fileName || "file"}`;
      case "share":
        return `${actorName} shared with ${context.sharedWith || "user"}`;
      case "move":
        return `${actorName} moved to ${context.newLocation || "location"}`;
      default:
        return `${actorName} performed ${activity.action}`;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Activity Log</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>Action</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      No activities yet
                    </TableCell>
                  </TableRow>
                ) : (
                  activities.map((activity) => (
                    <TableRow key={activity.id} hover>
                      <TableCell>
                        <Chip
                          icon={ACTION_ICONS[activity.action]}
                          label={
                            activity.action.charAt(0).toUpperCase() +
                            activity.action.slice(1)
                          }
                          color={ACTION_COLORS[activity.action]}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{getActivityDescription(activity)}</TableCell>
                      <TableCell sx={{ fontSize: "0.875rem", color: "#666" }}>
                        {format(
                          new Date(activity.created_at),
                          "MMM dd, yyyy HH:mm:ss",
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
