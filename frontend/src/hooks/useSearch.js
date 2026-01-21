import { useCallback, useState } from "react";
import { searchResources } from "@/services/search.api";

export const useSearch = () => {
  const [results, setResults] = useState({ files: [], folders: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const performSearch = useCallback(async (query) => {
    if (!query || query.trim().length === 0) {
      setResults({ files: [], folders: [] });
      setSearchQuery("");
      return;
    }

    setLoading(true);
    setError(null);
    setSearchQuery(query);

    try {
      const res = await searchResources(query);
      if (res.success) {
        setResults(res.data);
      } else {
        setError("Search failed");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setResults({ files: [], folders: [] });
    setSearchQuery("");
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchQuery,
    performSearch,
    clearSearch,
  };
};
