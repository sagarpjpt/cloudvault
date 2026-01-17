import { useEffect, useState } from "react";
import { getStarred } from "@/services/star.api";

export const useStarred = () => {
  const [starred, setStarred] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStarred = async () => {
      try {
        const res = await getStarred();

        if (res.success) {
          setStarred(res.data);
        } else {
          setError("Failed to load starred items");
        }
      } catch (err) {
        setError("Something went wrong while loading starred items");
      } finally {
        setLoading(false);
      }
    };

    fetchStarred();
  }, []);

  return {
    starred,
    loading,
    error,
  };
};
