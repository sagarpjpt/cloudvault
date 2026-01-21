import api from "@/lib/axios";

export const getStorageUsage = async () => {
  const res = await api.get("/files/usage/current");
  return res.data; // { success, data: { usedBytes, totalBytes, usedGB, totalGB, percentage, canUpload } }
};
