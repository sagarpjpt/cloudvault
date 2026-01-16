import api from "@/lib/axios";

// get all folders for logged-in user
export const getFolders = async () => {
  const res = await api.get("/folders");
  return res.data; // { success, data }
};
