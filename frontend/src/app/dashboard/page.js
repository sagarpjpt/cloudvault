"use client";

import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { useStarred } from "@/hooks/useStarred";
import { starResource, unstarResource } from "@/services/star.api";
import { useFileDownload } from "@/hooks/useFileDownload";
import { deleteFile } from "@/services/file.api";
import { useRename } from "@/hooks/useRename";
import FileUploadDialog from "@/components/dashboard/FileUploadDialog";
import CreateFolderDialog from "@/components/dashboard/CreateFolderDialog";
import ShareDialog from "@/components/dashboard/ShareDialog";
import StorageUsage from "@/components/dashboard/StorageUsage";
import FilePreview from "@/components/dashboard/FilePreview";
import { RenameDialog } from "@/components/common/RenameDialog";
import FolderCard from "@/components/dashboard/FolderCard";
import FileCard from "@/components/dashboard/FileCard";
import ActionMenu from "@/components/dashboard/ActionMenu";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import Link from "next/link";
import { useFolders } from "@/hooks/useFolders";
import { useFiles } from "@/hooks/useFiles";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const {
    folders,
    loading: foldersLoading,
    error: foldersError,
  } = useFolders();
  const { files, loading: filesLoading, error: filesError } = useFiles();

  const { starred } = useStarred();
  const { download, downloading } = useFileDownload();
  const { isRenaming, renameFile: renameFileHandler } = useRename();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedShareFile, setSelectedShareFile] = useState(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameItem, setRenameItem] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const starredFileIds = new Set(
    starred
      .filter((item) => item.resource_type === "file")
      .map((item) => item.resource_id),
  );

  const toggleStar = async (fileId, isStarred) => {
    try {
      if (isStarred) {
        await unstarResource({
          resourceType: "file",
          resourceId: fileId,
        });
        toast.success("Removed from starred");
      } else {
        await starResource({
          resourceType: "file",
          resourceId: fileId,
        });
        toast.success("Added to starred");
      }
    } catch (err) {
      console.error("Failed to toggle star", err);
      toast.error("Failed to toggle star");
    }
  };

  const handleDelete = async (fileId, fileName) => {
    if (confirm(`Delete "${fileName}"?`)) {
      try {
        await deleteFile(fileId);
        toast.success("File deleted");
        // Refresh files list
        window.location.reload();
      } catch (err) {
        toast.error("Failed to delete file");
      }
    }
  };

  const handleShareClick = (file) => {
    setSelectedShareFile(file);
    setShareDialogOpen(true);
  };

  const handleRenameClick = (file) => {
    setRenameItem({ id: file.id, name: file.name, type: "file" });
    setRenameDialogOpen(true);
  };

  const handleRenameConfirm = async (newName) => {
    if (!renameItem) return;

    const success = await renameFileHandler(renameItem.id, newName);
    if (success) {
      setRenameDialogOpen(false);
      setTimeout(() => window.location.reload(), 600);
    }
  };

  const handleUploadSuccess = () => {
    // Refresh files list
    window.location.reload();
  };

  const canPreview = (mimeType) => {
    return (
      mimeType.startsWith("image/") ||
      mimeType === "application/pdf" ||
      mimeType.startsWith("text/") ||
      mimeType === "application/json"
    );
  };

  const handlePreviewClick = (file) => {
    if (canPreview(file.mime_type)) {
      setPreviewFile(file);
      setPreviewOpen(true);
    } else {
      toast.error("File type not supported for preview");
    }
  };

  if (foldersLoading || filesLoading) {
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
          <p style={{ color: "var(--color-text-muted)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (foldersError || filesError) {
    return (
      <div className="flex items-center justify-center h-96">
        <p style={{ color: "#d32f2f" }}>Failed to load data</p>
      </div>
    );
  }

  const rootFolders = folders.filter((folder) => folder.parent_id === null);
  const rootFiles = files.filter((file) => file.folder_id === null);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Storage Usage */}
      <StorageUsage />

      {/* Header with Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: "var(--color-primary)" }}
        >
          My Files
        </h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateFolderDialogOpen(true)}
            sx={{
              backgroundColor: "var(--color-primary)",
              "&:hover": {
                backgroundColor: "var(--color-primary-hover)",
              },
              flex: 1,
              md: { flex: "none" },
            }}
          >
            <span className="hidden sm:inline">New Folder</span>
            <span className="sm:hidden">Folder</span>
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={() => setUploadDialogOpen(true)}
            sx={{
              backgroundColor: "var(--color-primary)",
              "&:hover": {
                backgroundColor: "var(--color-primary-hover)",
              },
              flex: 1,
              md: { flex: "none" },
            }}
          >
            <span className="hidden sm:inline">Upload File</span>
            <span className="sm:hidden">Upload</span>
          </Button>
        </div>
      </div>

      {/* FOLDERS SECTION */}
      {rootFolders.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <FolderIcon sx={{ color: "var(--color-primary)", fontSize: 24 }} />
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              Folders ({rootFolders.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rootFolders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} />
            ))}
          </div>
        </section>
      )}

      {/* FILES SECTION */}
      {rootFiles.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <InsertDriveFileIcon
              sx={{ color: "var(--color-primary)", fontSize: 24 }}
            />
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              Files ({rootFiles.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rootFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                isStarred={starredFileIds.has(file.id)}
                onToggleStar={() =>
                  toggleStar(file.id, starredFileIds.has(file.id))
                }
                onDownload={() => download(file.id, file.name)}
                onPreview={() => handlePreviewClick(file)}
                onRename={() => handleRenameClick(file)}
                onShare={() => handleShareClick(file)}
                onDelete={() => handleDelete(file.id, file.name)}
                downloading={downloading}
                canPreview={canPreview(file.mime_type)}
              />
            ))}
          </div>
        </section>
      )}

      {rootFolders.length === 0 && rootFiles.length === 0 && (
        <div className="text-center py-12">
          <HourglassEmptyIcon className="!text-5xl !mb-4" />
          <p
            className="text-lg font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            No files or folders yet. Start by uploading a file or creating a
            folder!
          </p>
        </div>
      )}

      {/* Dialogs */}
      <FileUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <CreateFolderDialog
        open={createFolderDialogOpen}
        onClose={() => setCreateFolderDialogOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      <ShareDialog
        open={shareDialogOpen}
        onClose={() => {
          setShareDialogOpen(false);
          setSelectedShareFile(null);
        }}
        resourceType="file"
        resourceId={selectedShareFile?.id}
        resourceName={selectedShareFile?.name}
        onShareSuccess={() => {
          toast.success("Share invitation sent!");
        }}
      />

      <RenameDialog
        open={renameDialogOpen}
        title={`Rename ${renameItem?.type === "file" ? "File" : "Folder"}`}
        currentName={renameItem?.name || ""}
        onConfirm={handleRenameConfirm}
        onCancel={() => setRenameDialogOpen(false)}
        isLoading={isRenaming}
      />

      {/* File Preview Dialog */}
      {previewFile && (
        <FilePreview
          open={previewOpen}
          onClose={() => {
            setPreviewOpen(false);
            setPreviewFile(null);
          }}
          fileId={previewFile.id}
          fileName={previewFile.name}
          mimeType={previewFile.mime_type}
        />
      )}
    </div>
  );
}

// export default DashboardPage;
