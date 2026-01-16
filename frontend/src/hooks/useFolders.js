import { useEffect, useState } from "react";
import { getFolders } from "@/services/folder.api";

export const useFolders = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await getFolders();

        if (res.success) {
          setFolders(res.data);
          console.log("Folders:", res.data);
        } else {
          setError("Failed to load folders");
        }
      } catch (err) {
        setError("Something went wrong while fetching folders");
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, []);

  return {
    folders,
    loading,
    error,
  };
};
