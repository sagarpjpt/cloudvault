import api from "@/lib/axios";

// get all files for logged-in user
export const getFiles = async () => {
  const res = await api.get("/files");
  return res.data; // { success, data }
};

// upload file
export const uploadFile = async (formData) => {
  const res = await api.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// get file versions
export const getFileVersions = async (fileId) => {
  const res = await api.get(`/files/${fileId}/versions`);
  return res.data;
};

// download file
export const downloadFile = async (fileId) => {
  const res = await api.get(`/files/${fileId}/download`, {
    responseType: "blob",
  });
  return res.data;
};

// delete file
export const deleteFile = async (fileId) => {
  const res = await api.delete(`/files/${fileId}`);
  return res.data;
};
