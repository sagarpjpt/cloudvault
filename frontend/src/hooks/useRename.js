import { useState } from "react";
import toast from "react-hot-toast";
import * as renameApi from "@/services/rename.api";

export const useRename = () => {
  const [isRenaming, setIsRenaming] = useState(false);

  const renameFileHandler = async (fileId, newName) => {
    if (!newName || !newName.trim()) {
      toast.error("File name cannot be empty");
      return;
    }

    setIsRenaming(true);
    try {
      await renameApi.renameFile(fileId, newName.trim());
      toast.success("File renamed successfully");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to rename file";
      toast.error(message);
      return false;
    } finally {
      setIsRenaming(false);
    }
  };

  const renameFolderHandler = async (folderId, newName) => {
    if (!newName || !newName.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }

    setIsRenaming(true);
    try {
      await renameApi.renameFolder(folderId, newName.trim());
      toast.success("Folder renamed successfully");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to rename folder";
      toast.error(message);
      return false;
    } finally {
      setIsRenaming(false);
    }
  };

  return {
    isRenaming,
    renameFile: renameFileHandler,
    renameFolder: renameFolderHandler,
  };
};
