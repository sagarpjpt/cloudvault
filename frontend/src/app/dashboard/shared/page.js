"use client";

import { useState } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
// import SecurityIcon from "@mui/icons-material/Security";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import SecurityIcon from '@mui/icons-material/Security';
import { useShared } from "@/hooks/useShared";
import { useFileDownload } from "@/hooks/useFileDownload";
import ShareDialog from "@/components/dashboard/ShareDialog";
import ActionMenu from "@/components/dashboard/ActionMenu";
import toast from "react-hot-toast";

export default function SharedPage() {
  const { shared, loading, error } = useShared();
  const { download, downloading } = useFileDownload();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedShareItem, setSelectedShareItem] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading shared resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  const sharedFiles = shared.filter((item) => item.resource_type === "file");
  const sharedFolders = shared.filter(
    (item) => item.resource_type === "folder",
  );

  const getRoleColor = (role) => {
    switch (role) {
      case "EDITOR":
        return "warning";
      case "VIEWER":
        return "info";
      default:
        return "default";
    }
  };

  const handleDownload = async (fileId, fileName) => {
    await download(fileId, fileName);
  };

  const handleShareClick = (resource) => {
    setSelectedShareItem({
      id: resource.resource_id,
      name:
        resource.resource_name ||
        `${resource.resource_type} ${resource.resource_id}`,
      type: resource.resource_type,
    });
    setShareDialogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <SecurityIcon sx={{ fontSize: 32, color: "var(--color-primary)" }} />
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            Shared with Me
          </h1>
        </div>
        <div className="flex gap-4 mt-2">
          <div className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            <VisibilityIcon sx={{ fontSize: 16, display: "inline", mr: 1 }} />
            <strong>Viewer:</strong> Download and view only
          </div>
          <div className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            <EditIcon sx={{ fontSize: 16, display: "inline", mr: 1 }} />
            <strong>Editor:</strong> Full access including delete and share
          </div>
        </div>
      </div>

      {/* SHARED FOLDERS */}
      {sharedFolders.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <FolderIcon sx={{ color: "var(--color-primary)", fontSize: 24 }} />
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              Shared Folders ({sharedFolders.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sharedFolders.map((folder) => (
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
                  <Chip
                    icon={<SecurityIcon />}
                    label={folder.role}
                    size="small"
                    sx={{
                      mt: 2,
                      backgroundColor:
                        folder.role === "EDITOR" ? "#fff3e0" : "#e3f2fd",
                      color: folder.role === "EDITOR" ? "#e65100" : "#1565c0",
                    }}
                  />
                </div>
                <div
                  className="mt-3 pt-3 border-t flex justify-between items-center"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <span className="text-xs text-gray-500">
                    {new Date(folder.created_at).toLocaleDateString()}
                  </span>
                  {folder.role === "EDITOR" && (
                    <Tooltip title="Share this folder">
                      <IconButton
                        size="small"
                        sx={{
                          color: "var(--color-primary)",
                        }}
                      >
                        <ShareIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SHARED FILES */}
      {sharedFiles.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <InsertDriveFileIcon
              sx={{ color: "var(--color-primary)", fontSize: 24 }}
            />
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              Shared Files ({sharedFiles.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sharedFiles.map((file) => {
              const actions = [];

              actions.push({
                label: "Download",
                iconName: "download",
                onClick: () =>
                  handleDownload(file.resource_id, `file-${file.resource_id}`),
              });

              if (file.role === "EDITOR") {
                actions.push({
                  label: "Share",
                  iconName: "share",
                  onClick: () => handleShareClick(file),
                });
              }

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
                    <Chip
                      icon={<SecurityIcon />}
                      label={file.role}
                      size="small"
                      sx={{
                        mt: 2,
                        backgroundColor:
                          file.role === "EDITOR" ? "#fff3e0" : "#e3f2fd",
                        color: file.role === "EDITOR" ? "#e65100" : "#1565c0",
                      }}
                    />
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

      {shared.length === 0 && (
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
          <SecurityIcon className="!text-5xl !mb-4" />
          <p
            className="text-lg font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            No resources shared with you yet
          </p>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--color-text-muted)" }}
          >
            When someone shares a file or folder with you, it will appear here
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

// export default SharedPage;
