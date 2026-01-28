"use client";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { IconButton, Tooltip } from "@mui/material";
import ActionMenu from "./ActionMenu";

export default function FileCard({
  file,
  isStarred,
  onToggleStar,
  onDownload,
  onPreview,
  onRename,
  onShare,
  onDelete,
  onVersionHistory,
  downloading,
  canPreview,
}) {
  const actions = [];

  if (onDownload) {
    actions.push({
      label: "Download",
      iconName: "download",
      onClick: onDownload,
    });
  }

  if (canPreview && onPreview) {
    actions.push({
      label: "Preview",
      iconName: "preview",
      onClick: onPreview,
    });
  }

  if (onRename) {
    actions.push({
      label: "Rename",
      iconName: "rename",
      onClick: onRename,
    });
  }

  if (onShare) {
    actions.push({
      label: "Share",
      iconName: "share",
      onClick: onShare,
    });
  }

  if (onVersionHistory) {
    actions.push({
      label: "Version History",
      iconName: "history",
      onClick: onVersionHistory,
    });
  }

  if (onDelete) {
    actions.push({
      label: "Delete",
      iconName: "delete",
      onClick: onDelete,
      color: "#d32f2f",
    });
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileType = () => {
    const ext = file.name.split(".").pop().toUpperCase();
    return ext.length > 4 ? "FILE" : ext;
  };

  return (
    <div
      className="group bg-white border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col"
      style={{
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <Tooltip title={isStarred ? "Remove from starred" : "Add to starred"}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              onToggleStar();
            }}
            sx={{
              color: isStarred
                ? "var(--color-accent)"
                : "var(--color-text-muted)",
              "&:hover": { color: "var(--color-primary)" },
            }}
          >
            {isStarred ? (
              <StarIcon fontSize="small" />
            ) : (
              <StarBorderIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        {actions.length > 0 && <ActionMenu actions={actions} />}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <InsertDriveFileIcon
          sx={{
            fontSize: 40,
            color: "var(--color-accent)",
            mb: 1,
          }}
        />
        <p className="font-medium text-sm break-words line-clamp-2 flex-1">
          {file.name}
        </p>
      </div>

      <div
        className="mt-3 pt-3 border-t"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
            {getFileType()}
          </span>
          <span>{formatFileSize(Number(file.size))}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(file.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
