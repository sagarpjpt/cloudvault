import { useState } from "react";
import { uploadFile as uploadFileApi } from "@/services/file.api";
import toast from "react-hot-toast";

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file, folderId = null) => {
    if (!file) {
      toast.error("No file selected");
      return false;
    }

    // Validate file size (50MB limit)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("File size exceeds 50MB limit");
      return false;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (folderId) {
        formData.append("folderId", folderId);
      }

      // Simulate progress (real progress depends on axios config)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 30;
        });
      }, 300);

      const result = await uploadFileApi(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        toast.success("File uploaded successfully");
        return true;
      } else {
        toast.error(result.message || "Upload failed");
        return false;
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err?.response?.data?.message || "Upload failed");
      return false;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadFile,
    uploading,
    uploadProgress,
  };
};
