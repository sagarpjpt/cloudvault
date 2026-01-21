"use client";

import { useState } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";
import DownloadIcon from "@mui/icons-material/Download";
// import StarIcon from "@mui/icons-material/Star";
import ShareIcon from "@mui/icons-material/Share";
import StarIcon from "@mui/icons-material/Star";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";

import { useStarred } from "@/hooks/useStarred";
import { useFileDownload } from "@/hooks/useFileDownload";
import { unstarResource } from "@/services/star.api";
import { deleteFile } from "@/services/file.api";
import ShareDialog from "@/components/dashboard/ShareDialog";
import ActionMenu from "@/components/dashboard/ActionMenu";
import toast from "react-hot-toast";

export default function StarredPage() {
  const { starred, loading, error, refresh } = useStarred();
  const { download, downloading } = useFileDownload();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedShareItem, setSelectedShareItem] = useState(null);

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
          <p style={{ color: "var(--color-text-muted)" }}>
            Loading starred items...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p style={{ color: "#d32f2f" }}>{error}</p>
      </div>
    );
  }

  // Filter out deleted items (exists = false)
  const validStarred = starred.filter((item) => item.exists !== false);

  const starredFiles = validStarred.filter(
    (item) => item.resource_type === "file",
  );
  const starredFolders = validStarred.filter(
    (item) => item.resource_type === "folder",
  );

  const handleUnstar = async (resourceType, resourceId) => {
    try {
      await unstarResource({
        resourceType,
        resourceId,
      });
      toast.success("Removed from starred");
      refresh(); // Refresh instead of full reload
    } catch (err) {
      toast.error("Failed to unstar");
    }
  };

  const handleDownload = async (fileId, fileName) => {
    await download(fileId, fileName);
  };

  const handleDelete = async (fileId, fileName) => {
    if (confirm(`Delete "${fileName}"?`)) {
      try {
        await deleteFile(fileId);
        toast.success("File deleted");
        refresh(); // Refresh starred list instead of full reload
      } catch (err) {
        toast.error("Failed to delete file");
      }
    }
  };

  const handleShareClick = (item) => {
    setSelectedShareItem({
      id: item.resource_id,
      name: item.resource_name || `${item.resource_type} ${item.resource_id}`,
      type: item.resource_type,
    });
    setShareDialogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1
        className="text-2xl md:text-3xl font-bold mb-8"
        style={{ color: "var(--color-primary)" }}
      >
        <StarIcon /> Starred Items
      </h1>

      {/* STARRED FOLDERS */}
      {starredFolders.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <FolderIcon sx={{ color: "var(--color-primary)", fontSize: 24 }} />
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              Folders ({starredFolders.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {starredFolders.map((folder) => (
              <div
                key={`folder-${folder.resource_id}`}
                className="bg-white border rounded-lg p-4 hover:shadow-md transition-all"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <FolderIcon
                    sx={{
                      fontSize: 40,
                      color: "var(--color-accent)",
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm line-clamp-2">
                    {folder.resource_name || `Folder ${folder.resource_id}`}
                  </p>
                </div>
                <div
                  className="mt-3 pt-3 border-t flex justify-between items-center"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <span className="text-xs text-gray-500">
                    {new Date(folder.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-1">
                    <Tooltip title="Share folder">
                      <IconButton
                        size="small"
                        onClick={() => handleShareClick(folder)}
                        sx={{
                          color: "var(--color-primary)",
                        }}
                      >
                        <ShareIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove from starred">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleUnstar("folder", folder.resource_id)
                        }
                        sx={{
                          color: "var(--color-accent)",
                        }}
                      >
                        <StarIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STARRED FILES */}
      {starredFiles.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <InsertDriveFileIcon
              sx={{ color: "var(--color-primary)", fontSize: 24 }}
            />
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              Files ({starredFiles.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {starredFiles.map((file) => {
              const actions = [];

              actions.push({
                label: "Download",
                iconName: "download",
                onClick: () =>
                  handleDownload(
                    file.resource_id,
                    file.resource_name || `file-${file.resource_id}`,
                  ),
              });

              actions.push({
                label: "Share",
                iconName: "share",
                onClick: () => handleShareClick(file),
              });

              actions.push({
                label: "Unstar",
                iconName: "unstar",
                onClick: () => handleUnstar("file", file.resource_id),
              });

              actions.push({
                label: "Delete",
                iconName: "delete",
                onClick: () =>
                  handleDelete(
                    file.resource_id,
                    file.resource_name || `file-${file.resource_id}`,
                  ),
                color: "#d32f2f",
              });

              return (
                <div
                  key={`file-${file.resource_id}`}
                  className="bg-white border rounded-lg p-4 hover:shadow-md transition-all"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <InsertDriveFileIcon
                      sx={{
                        fontSize: 40,
                        color: "var(--color-accent)",
                      }}
                    />
                    {actions.length > 0 && <ActionMenu actions={actions} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-2">
                      {file.resource_name || `File ${file.resource_id}`}
                    </p>
                  </div>
                  <div
                    className="mt-3 pt-3 border-t"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <span className="text-xs text-gray-500">
                      {new Date(file.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {validStarred.length === 0 && (
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
          <StarIcon className="!text-5xl !mb-4" />
          <p
            className="text-lg font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            No starred items yet
          </p>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--color-text-muted)" }}
          >
            Star your favorite files and folders to access them quickly from
            here
          </p>
        </Box>
      )}

      <ShareDialog
        open={shareDialogOpen}
        onClose={() => {
          setShareDialogOpen(false);
          setSelectedShareItem(null);
        }}
        resourceType={selectedShareItem?.type}
        resourceId={selectedShareItem?.id}
        resourceName={selectedShareItem?.name}
        onShareSuccess={() => {
          toast.success("Share invitation sent!");
        }}
      />
    </div>
  );
}

// export default StarredPage;
