import axios from "@/lib/axios";

// Get all trash items
export const getTrash = async () => {
  try {
    const response = await axios.get("/trash");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Restore file from trash
export const restoreFile = async (fileId) => {
  try {
    const response = await axios.post(`/trash/restore-file/${fileId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Restore folder from trash
export const restoreFolder = async (folderId) => {
  try {
    const response = await axios.post(`/trash/restore-folder/${folderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Permanently delete file
export const permanentlyDeleteFile = async (fileId) => {
  try {
    const response = await axios.delete(`/trash/file/${fileId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Permanently delete folder
export const permanentlyDeleteFolder = async (folderId) => {
  try {
    const response = await axios.delete(`/trash/folder/${folderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Empty entire trash
export const emptyTrash = async () => {
  try {
    const response = await axios.delete("/trash");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
