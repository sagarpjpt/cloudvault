import { useEffect, useState } from "react";
import { getStorageUsage } from "@/services/storage.api";

export const useStorageUsage = () => {
  const [storage, setStorage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const res = await getStorageUsage();
      if (res.success) {
        setStorage(res.data);
      } else {
        setError("Failed to load storage usage");
      }
    } catch (err) {
      console.error("Storage usage error:", err);
      setError("Failed to load storage usage");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  return { storage, loading, error, refetch: fetchUsage };
};
