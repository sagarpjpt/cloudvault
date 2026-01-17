import api from "@/lib/axios";

// get starred files/folders for logged-in user
export const getStarred = async () => {
  const res = await api.get("/stars");
  return res.data; // { success, data }
};

// star a resource (file or folder)
export const starResource = async ({ resourceType, resourceId }) => {
  const res = await api.post("/stars", {
    resourceType,
    resourceId,
  });
  return res.data;
};

// unstar a resource (file or folder)
export const unstarResource = async ({ resourceType, resourceId }) => {
  const res = await api.delete("/stars", {
    data: {
      resourceType,
      resourceId,
    },
  });
  return res.data;
};