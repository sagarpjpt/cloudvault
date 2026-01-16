import { useEffect, useState } from "react";
import { getFiles } from "@/services/file.api";

export const useFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await getFiles();

        if (res.success) {
          setFiles(res.data);
          console.log("Files:", res.data);
        } else {
          setError("Failed to load files");
        }
      } catch (err) {
        setError("Something went wrong while fetching files");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return {
    files,
    loading,
    error,
  };
};
