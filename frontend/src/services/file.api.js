import api from "@/lib/axios";

// get all files for logged-in user
export const getFiles = async () => {
  const res = await api.get("/files");
  return res.data; // { success, data }
};
