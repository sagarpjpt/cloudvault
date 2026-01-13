const express = require("express");
const router = express.Router();

const {
  createFile,
  getFiles,
  uploadFile,
  getFileVersions,
} = require("../controllers/file.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.post("/", authMiddleware, createFile);
router.get("/", authMiddleware, getFiles);

// upload file route
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);

router.get('/:id/versions', authMiddleware, getFileVersions)

module.exports = router;
