import api from "@/lib/axios";

// get files/folders shared with logged-in user
export const getSharedWithMe = async () => {
  const res = await api.get("/shares/me");
  return res.data; // { success, data }
};
