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
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";

export default function FileVersionHistory({
  fileId,
  fileName,
  open,
  onClose,
  onRollback,
}) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [restoring, setRestoring] = useState(null);

  useEffect(() => {
    if (open && fileId) {
      fetchVersions();
    }
  }, [open, fileId]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/files/${fileId}/versions`);
      setVersions(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch versions");
      console.error("Error fetching versions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (versionId) => {
    try {
      setRestoring(versionId);
      const response = await api.post(`/files/${fileId}/rollback`, {
        versionId,
      });

      if (response.data.success) {
        onRollback?.();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to rollback version");
      console.error("Error rolling back:", err);
    } finally {
      setRestoring(null);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Version History - {fileName}</DialogTitle>
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
                  <TableCell>Version</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {versions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      No versions found
                    </TableCell>
                  </TableRow>
                ) : (
                  versions.map((version) => (
                    <TableRow key={version.id} hover>
                      <TableCell>v{version.version_number}</TableCell>
                      <TableCell>{formatBytes(version.size)}</TableCell>
                      <TableCell>
                        {format(
                          new Date(version.created_at),
                          "MMM dd, yyyy HH:mm",
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {version.version_number > 1 && (
                          <Button
                            size="small"
                            startIcon={<RestoreIcon />}
                            onClick={() => handleRollback(version.id)}
                            disabled={restoring !== null}
                            variant="outlined"
                          >
                            {restoring === version.id
                              ? "Restoring..."
                              : "Restore"}
                          </Button>
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
