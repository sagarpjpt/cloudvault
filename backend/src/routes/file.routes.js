const express = require("express");
const router = express.Router();

const {
  createFile,
  getFiles,
  uploadFile,
  getFileVersions,
  downloadFile,
  deleteFile,
  renameFile,
  getStorageUsage,
} = require("../controllers/file.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.post("/", authMiddleware, createFile);
router.get("/", authMiddleware, getFiles);
router.get("/usage/current", authMiddleware, getStorageUsage);

// upload file route
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);

router.get("/:id/versions", authMiddleware, getFileVersions);
router.get("/:id/download", authMiddleware, downloadFile);
router.patch("/:id", authMiddleware, renameFile);
router.delete("/:id", authMiddleware, deleteFile);

module.exports = router;
