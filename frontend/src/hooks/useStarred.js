import { useEffect, useState } from "react";
import { getStarred } from "@/services/star.api";
import { getFiles } from "@/services/file.api";
import { getFolders } from "@/services/folder.api";

export const useStarred = () => {
  const [starred, setStarred] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchStarred = async () => {
      try {
        const res = await getStarred();

        if (res.success) {
          const starredItems = res.data;

          // Fetch file and folder details to get names
          const enrichedItems = await Promise.all(
            starredItems.map(async (item) => {
              try {
                if (item.resource_type === "file") {
                  // Try to fetch file details - if deleted, it will return null
                  const fileRes = await getFiles();
                  const file = fileRes.data?.find(
                    (f) => f.id === item.resource_id,
                  );
                  return {
                    ...item,
                    resource_name: file?.name || null,
                    exists: !!file,
                  };
                } else if (item.resource_type === "folder") {
                  // Try to fetch folder details - if deleted, it will return null
                  const folderRes = await getFolders();
                  const folder = folderRes.data?.find(
                    (f) => f.id === item.resource_id,
                  );
                  return {
                    ...item,
                    resource_name: folder?.name || null,
                    exists: !!folder,
                  };
                }
              } catch (err) {
                return {
                  ...item,
                  resource_name: null,
                  exists: false,
                };
              }
              return item;
            }),
          );

          setStarred(enrichedItems);
        } else {
          setError("Failed to load starred items");
        }
      } catch (err) {
        console.error("Error loading starred items:", err);
        setError("Something went wrong while loading starred items");
      } finally {
        setLoading(false);
      }
    };

    fetchStarred();
  }, [refreshKey]);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return {
    starred,
    loading,
    error,
    refresh,
  };
};
