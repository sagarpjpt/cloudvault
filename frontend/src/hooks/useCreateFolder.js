import { useState } from "react";
import { createFolder as createFolderApi } from "@/services/folder.api";
import toast from "react-hot-toast";

export const useCreateFolder = () => {
  const [creating, setCreating] = useState(false);

  const createFolder = async (name, parentId = null) => {
    if (!name || name.trim() === "") {
      toast.error("Folder name is required");
      return false;
    }

    setCreating(true);
    try {
      const result = await createFolderApi(name.trim(), parentId);

      if (result.success) {
        toast.success("Folder created successfully");
        return true;
      } else {
        toast.error(result.message || "Failed to create folder");
        return false;
      }
    } catch (err) {
      console.error("Create folder error:", err);
      toast.error(err?.response?.data?.message || "Failed to create folder");
      return false;
    } finally {
      setCreating(false);
    }
  };

  return {
    createFolder,
    creating,
  };
};
