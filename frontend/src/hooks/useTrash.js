import { useState, useEffect } from "react";
import { getTrash } from "@/services/trash.api";

export function useTrash() {
  const [trash, setTrash] = useState({ files: [], folders: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTrash();
      if (response.success) {
        setTrash(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch trash:", err);
      setError(err.message || "Failed to fetch trash");
    } finally {
      setLoading(false);
    }
  };

  return {
    trash,
    loading,
    error,
    refetch: fetchTrash,
  };
}
