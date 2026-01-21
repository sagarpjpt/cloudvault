import api from "@/lib/axios";

// get all folders for logged-in user
export const getFolders = async () => {
  const res = await api.get("/folders");
  return res.data; // { success, data }
};

// create folder
export const createFolder = async (name, parentId = null) => {
  const res = await api.post("/folders", {
    name,
    parentId,
  });
  return res.data;
};

// get folder contents (files and subfolders)
export const getFolderContents = async (folderId) => {
  const res = await api.get(`/folders/${folderId}`);
  return res.data;
};

// delete folder
export const deleteFolder = async (folderId) => {
  const res = await api.delete(`/folders/${folderId}`);
  return res.data;
};
