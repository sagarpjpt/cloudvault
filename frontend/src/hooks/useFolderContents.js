import { useEffect, useState } from "react";
import { getFolderContents } from "@/services/folder.api";

export const useFolderContents = (folderId) => {
  const [folder, setFolder] = useState(null);
  const [subfolders, setSubfolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContents = async () => {
      if (!folderId) {
        setLoading(false);
        return;
      }

      try {
        const res = await getFolderContents(folderId);

        if (res.success) {
          setFolder(res.data.folder);
          setSubfolders(res.data.subfolders || []);
          setFiles(res.data.files || []);
        } else {
          setError("Failed to load folder contents");
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [folderId]);

  return {
    folder,
    subfolders,
    files,
    loading,
    error,
  };
};
