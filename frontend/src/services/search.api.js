import api from "@/lib/axios";

export const searchResources = async (query) => {
  if (!query || query.trim().length === 0) {
    return { success: false, data: { files: [], folders: [] } };
  }

  const res = await api.get("/search", {
    params: { query: query.trim() },
  });
  return res.data; // { success, data: { files, folders, query } }
};
