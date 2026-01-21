import axios from "@/lib/axios";

export const renameFile = (fileId, newName) => {
  return axios.patch(`/api/files/${fileId}`, {
    newName,
  });
};

export const renameFolder = (folderId, newName) => {
  return axios.patch(`/api/folders/${folderId}`, {
    newName,
  });
};
