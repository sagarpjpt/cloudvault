"use client";

import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import toast from "react-hot-toast";

import { useTrash } from "@/hooks/useTrash";
import {
  restoreFile,
  restoreFolder,
  permanentlyDeleteFile,
  permanentlyDeleteFolder,
  emptyTrash,
} from "@/services/trash.api";
import ActionMenu from "@/components/dashboard/ActionMenu";

export default function TrashPage() {
  const { trash, loading, error, refetch } = useTrash();
  const [emptyConfirmOpen, setEmptyConfirmOpen] = useState(false);

  const handleRestoreFile = async (fileId) => {
    try {
      await restoreFile(fileId);
      toast.success("File restored successfully");
      await refetch();
    } catch (err) {
      console.error("Failed to restore file:", err);
      toast.error("Failed to restore file");
    }
  };

  const handleRestoreFolder = async (folderId) => {
    try {
      await restoreFolder(folderId);
      toast.success("Folder restored successfully");
      await refetch();
    } catch (err) {
      console.error("Failed to restore folder:", err);
      toast.error("Failed to restore folder");
    }
  };

  const handlePermanentlyDeleteFile = async (fileId, fileName) => {
    if (confirm(`Permanently delete "${fileName}"? This cannot be undone.`)) {
      try {
        await permanentlyDeleteFile(fileId);
        toast.success("File permanently deleted");
        await refetch();
      } catch (err) {
        console.error("Failed to delete file:", err);
        toast.error("Failed to delete file");
      }
    }
  };

  const handlePermanentlyDeleteFolder = async (folderId, folderName) => {
    if (
      confirm(
        `Permanently delete folder "${folderName}" and all contents? This cannot be undone.`,
      )
    ) {
      try {
        await permanentlyDeleteFolder(folderId);
        toast.success("Folder permanently deleted");
        await refetch();
      } catch (err) {
        console.error("Failed to delete folder:", err);
        toast.error("Failed to delete folder");
      }
    }
  };

  const handleEmptyTrash = async () => {
    try {
      await emptyTrash();
      setEmptyConfirmOpen(false);
      toast.success("Trash emptied");
      await refetch();
    } catch (err) {
      console.error("Failed to empty trash:", err);
      toast.error("Failed to empty trash");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{
              borderColor: "var(--color-border)",
              borderTopColor: "var(--color-primary)",
            }}
          />
          <p style={{ color: "var(--color-text-muted)" }}>Loading trash...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p style={{ color: "#d32f2f" }}>Failed to load trash</p>
      </div>
    );
  }

  const totalItems = trash.files.length + trash.folders.length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            Trash
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            {totalItems} item{totalItems !== 1 ? "s" : ""} in trash
          </p>
        </div>
        {totalItems > 0 && (
          <Button
            variant="contained"
            startIcon={<DeleteForeverIcon />}
            onClick={() => setEmptyConfirmOpen(true)}
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
            Empty Trash
          </Button>
        )}
      </div>

      {/* Folders Section */}
      {trash.folders.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <FolderIcon sx={{ color: "var(--color-primary)", fontSize: 24 }} />
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              Deleted Folders ({trash.folders.length})
            </h2>
          </div>
          <div className="space-y-2">
            {trash.folders.map((folder) => {
              const actions = [
                {
                  label: "Restore",
                  iconName: "restore",
                  onClick: () => handleRestoreFolder(folder.id),
                },
                {
                  label: "Delete Forever",
                  iconName: "delete",
                  onClick: () =>
                    handlePermanentlyDeleteFolder(folder.id, folder.name),
                  color: "#d32f2f",
                },
              ];

              return (
                <div
                  key={folder.id}
                  className="bg-white border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-all group"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FolderIcon
                      sx={{ color: "var(--color-accent)", fontSize: 24 }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{folder.name}</p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Deleted on {formatDate(folder.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {actions.length > 0 && <ActionMenu actions={actions} />}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Files Section */}
      {trash.files.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <InsertDriveFileIcon
              sx={{ color: "var(--color-primary)", fontSize: 24 }}
            />
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              Deleted Files ({trash.files.length})
            </h2>
          </div>
          <div className="space-y-2">
            {trash.files.map((file) => {
              const actions = [
                {
                  label: "Restore",
                  iconName: "restore",
                  onClick: () => handleRestoreFile(file.id),
                },
                {
                  label: "Delete Forever",
                  iconName: "delete",
                  onClick: () =>
                    handlePermanentlyDeleteFile(file.id, file.name),
                  color: "#d32f2f",
                },
              ];

              return (
                <div
                  key={file.id}
                  className="bg-white border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-all group"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <InsertDriveFileIcon
                      sx={{ color: "var(--color-accent)", fontSize: 24 }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{file.name}</p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {formatFileSize(Number(file.size))} • Deleted on{" "}
                        {formatDate(file.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {actions.length > 0 && <ActionMenu actions={actions} />}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {totalItems === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 12,
            px: 4,
            backgroundColor: "background.paper",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <HourglassEmptyIcon className="!text-5xl !mb-4" />
          <p
            className="text-lg font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            Your trash is empty
          </p>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--color-text-muted)" }}
          >
            Deleted files and folders will appear here
          </p>
        </Box>
      )}

      {/* Empty Trash Confirmation Dialog */}
      <Dialog
        open={emptyConfirmOpen}
        onClose={() => setEmptyConfirmOpen(false)}
      >
        <DialogTitle>Empty Trash?</DialogTitle>
        <DialogContent>
          <p>
            This will permanently delete all items in the trash. This action
            cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmptyConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEmptyTrash}
            variant="contained"
            sx={{
              backgroundColor: "#d32f2f",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
            Empty Trash
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
