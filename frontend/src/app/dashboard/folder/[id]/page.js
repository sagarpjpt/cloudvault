"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { useFolders } from "@/hooks/useFolders";
import { useFolderContents } from "@/hooks/useFolderContents";
import { buildBreadcrumbs } from "@/utils/buildBreadcrumbs";
import FolderBreadcrumb from "@/components/dashboard/FolderBreadcrumb";
import FileUploadDialog from "@/components/dashboard/FileUploadDialog";
import CreateFolderDialog from "@/components/dashboard/CreateFolderDialog";
import ShareDialog from "@/components/dashboard/ShareDialog";
import { useRename } from "@/hooks/useRename";
import { RenameDialog } from "@/components/common/RenameDialog";
import FilePreview from "@/components/dashboard/FilePreview";
import FolderCard from "@/components/dashboard/FolderCard";
import FileCard from "@/components/dashboard/FileCard";
import ActionMenu from "@/components/dashboard/ActionMenu";

import { useStarred } from "@/hooks/useStarred";
import { starResource, unstarResource } from "@/services/star.api";
import { useFileDownload } from "@/hooks/useFileDownload";
import { deleteFile } from "@/services/file.api";
import { deleteFolder } from "@/services/folder.api";
import toast from "react-hot-toast";

export default function FolderPage() {
  const { id } = useParams();
  const { folders } = useFolders();
  const { subfolders, files, loading, error } = useFolderContents(id);
  const { starred } = useStarred();
  const { download, downloading } = useFileDownload();
  const {
    isRenaming,
    renameFile: renameFileHandler,
    renameFolder: renameFolderHandler,
  } = useRename();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedShareItem, setSelectedShareItem] = useState(null);
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
        window.location.reload();
      } catch (err) {
        toast.error("Failed to delete file");
      }
    }
  };

  const handleDeleteFolder = async (folderId, folderName) => {
    if (confirm(`Delete folder "${folderName}" and all its contents?`)) {
      try {
        await deleteFolder(folderId);
        toast.success("Folder deleted");
        window.location.reload();
      } catch (err) {
        toast.error("Failed to delete folder");
      }
    }
  };

  const handleDownload = async (fileId, fileName) => {
    await download(fileId, fileName);
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

  const handleShareClick = (file) => {
    setSelectedShareItem({
      id: file.id,
      name: file.name,
      type: "file",
    });
    setShareDialogOpen(true);
  };

  const handleShareFolderClick = (folder) => {
    setSelectedShareItem({
      id: folder.id,
      name: folder.name,
      type: "folder",
    });
    setShareDialogOpen(true);
  };

  const handleRenameClick = (item, type) => {
    setRenameItem({ id: item.id, name: item.name, type });
    setRenameDialogOpen(true);
  };

  const handleRenameConfirm = async (newName) => {
    if (!renameItem) return;

    if (renameItem.type === "file") {
      const success = await renameFileHandler(renameItem.id, newName);
      if (success) {
        setRenameDialogOpen(false);
        setTimeout(() => window.location.reload(), 600);
      }
    } else {
      const success = await renameFolderHandler(renameItem.id, newName);
      if (success) {
        setRenameDialogOpen(false);
        setTimeout(() => window.location.reload(), 600);
      }
    }
  };

  const handleUploadSuccess = () => {
    window.location.reload();
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
          <p style={{ color: "var(--color-text-muted)" }}>Loading folder...</p>
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

  const breadcrumbs = buildBreadcrumbs(folders, id);

  return (
    <div className="max-w-7xl mx-auto">
      {/* BREADCRUMBS */}
      <FolderBreadcrumb breadcrumbs={breadcrumbs} />

      {/* HEADER WITH BUTTONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-8 gap-4">
        <div className="flex items-center gap-2">
          <FolderIcon sx={{ fontSize: 32, color: "var(--color-primary)" }} />
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            {breadcrumbs[breadcrumbs.length - 1]?.name || "Folder"}
          </h1>
        </div>
        <div className="flex gap-2 w-full md:w-80">
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

      <FileUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        folderId={id}
        onUploadSuccess={handleUploadSuccess}
      />

      <CreateFolderDialog
        open={createFolderDialogOpen}
        onClose={() => setCreateFolderDialogOpen(false)}
        parentId={id}
        onSuccess={handleUploadSuccess}
      />

      {/* SUBFOLDERS */}
      {subfolders.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <FolderIcon sx={{ color: "var(--color-primary)", fontSize: 24 }} />
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              Subfolders ({subfolders.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {subfolders.map((folder) => {
              const actions = [
                {
                  label: "Rename",
                  iconName: "rename",
                  onClick: () => handleRenameClick(folder, "folder"),
                },
                {
                  label: "Delete",
                  iconName: "delete",
                  onClick: () => handleDeleteFolder(folder.id, folder.name),
                  color: "#d32f2f",
                },
              ];

              return (
                <div
                  key={folder.id}
                  className="bg-white border rounded-lg p-4 hover:shadow-md transition-all relative group"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <Link
                    href={`/dashboard/folder/${folder.id}`}
                    className="block"
                  >
                    <FolderIcon
                      sx={{
                        fontSize: 40,
                        color: "var(--color-accent)",
                        mb: 1,
                      }}
                    />
                    <p className="font-medium text-sm break-words line-clamp-2">
                      {folder.name}
                    </p>
                  </Link>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {actions.length > 0 && <ActionMenu actions={actions} />}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* FILES */}
      {files.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <InsertDriveFileIcon
              sx={{ color: "var(--color-primary)", fontSize: 24 }}
            />
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              Files ({files.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {files.map((file) => {
              const isStarred = starredFileIds.has(file.id);
              const actions = [];

              actions.push({
                label: "Download",
                iconName: "download",
                onClick: () => handleDownload(file.id, file.name),
              });

              if (canPreview(file.mime_type)) {
                actions.push({
                  label: "Preview",
                  iconName: "preview",
                  onClick: () => handlePreviewClick(file),
                });
              }

              actions.push({
                label: "Rename",
                iconName: "rename",
                onClick: () => handleRenameClick(file, "file"),
              });

              actions.push({
                label: "Share",
                iconName: "share",
                onClick: () => handleShareClick(file),
              });

              actions.push({
                label: "Delete",
                iconName: "delete",
                onClick: () => handleDelete(file.id, file.name),
                color: "#d32f2f",
              });

              return (
                <FileCard
                  key={file.id}
                  file={file}
                  isStarred={isStarred}
                  onToggleStar={() => toggleStar(file.id, isStarred)}
                  onDownload={() => handleDownload(file.id, file.name)}
                  onPreview={() => handlePreviewClick(file)}
                  onRename={() => handleRenameClick(file, "file")}
                  onShare={() => handleShareClick(file)}
                  onDelete={() => handleDelete(file.id, file.name)}
                  downloading={downloading}
                  canPreview={canPreview(file.mime_type)}
                />
              );
            })}
          </div>
        </section>
      )}

      {subfolders.length === 0 && files.length === 0 && (
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
            style={{ color: "var(--color-primary)" }}
          >
            This folder is empty
          </p>
          <p
            className="text-sm mt-2"
            style={{ color: "var(--color-text-muted)" }}
          >
            Upload files or create folders to get started
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

      <RenameDialog
        open={renameDialogOpen}
        title={`Rename ${renameItem?.type === "file" ? "File" : "Folder"}`}
        currentName={renameItem?.name || ""}
        onConfirm={handleRenameConfirm}
        onCancel={() => setRenameDialogOpen(false)}
        isLoading={isRenaming}
      />

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

// export default FolderPage;
