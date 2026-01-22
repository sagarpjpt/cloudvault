const express = require("express");
const router = express.Router();

const {
  getTrash,
  restoreFile,
  restoreFolder,
  permanentlyDeleteFile,
  permanentlyDeleteFolder,
  emptyTrash,
} = require("../controllers/trash.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

// Get all trash items
router.get("/", authMiddleware, getTrash);

// Restore file from trash
router.post("/restore-file/:fileId", authMiddleware, restoreFile);

// Restore folder from trash
router.post("/restore-folder/:folderId", authMiddleware, restoreFolder);

// Permanently delete file
router.delete("/file/:fileId", authMiddleware, permanentlyDeleteFile);

// Permanently delete folder
router.delete("/folder/:folderId", authMiddleware, permanentlyDeleteFolder);

// Empty entire trash
router.delete("/", authMiddleware, emptyTrash);

module.exports = router;
