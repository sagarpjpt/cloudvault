import api from "@/lib/axios";

// get files/folders shared with logged-in user
export const getSharedWithMe = async () => {
  const res = await api.get("/shares/me");
  return res.data; // { success, data }
};

// share resource with another user
export const shareResource = async (resourceType, resourceId, email, role) => {
  const res = await api.post("/shares", {
    resourceType,
    resourceId,
    email,
    role,
  });
  return res.data;
};

// create public link
export const createPublicLink = async (
  resourceType,
  resourceId,
  role,
  expiresAt,
  password,
) => {
  const res = await api.post("/public-links", {
    resourceType,
    resourceId,
    role,
    expiresAt,
    password,
  });
  return res.data;
};

// access public link (without auth)
export const accessPublicLink = async (token, password = null) => {
  const res = await api.post(`/public-links/${token}`, {
    password,
  });
  return res.data;
};
