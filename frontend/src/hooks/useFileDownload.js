import { useState } from "react";
import { downloadFile } from "@/services/file.api";
import toast from "react-hot-toast";

export const useFileDownload = () => {
  const [downloading, setDownloading] = useState(false);

  const download = async (fileId, fileName) => {
    setDownloading(true);
    try {
      console.log("Downloading file:", fileId, fileName);
      const blob = await downloadFile(fileId);

      console.log("Blob received:", blob.size, blob.type);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("File downloaded successfully");
      return true;
    } catch (err) {
      console.error("Download error:", err);
      console.error("Error details:", err?.response?.data);
      toast.error(err?.response?.data?.message || "Download failed");
      return false;
    } finally {
      setDownloading(false);
    }
  };

  return {
    download,
    downloading,
  };
};
