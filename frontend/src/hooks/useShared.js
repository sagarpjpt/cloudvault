import { useEffect, useState } from "react";
import { getSharedWithMe } from "@/services/share.api";

export const useShared = () => {
  const [shared, setShared] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const res = await getSharedWithMe();

        if (res.success) {
          setShared(res.data);
        } else {
          setError("Failed to load shared resources");
        }
      } catch (err) {
        setError("Something went wrong while loading shared resources");
      } finally {
        setLoading(false);
      }
    };

    fetchShared();
  }, []);

  return {
    shared,
    loading,
    error,
  };
};
