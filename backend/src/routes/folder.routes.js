const express = require("express");
const router = express.Router();

const {
  createFolder,
  getFolders,
  getFolderContents,
  deleteFolder,
  renameFolder,
} = require("../controllers/folder.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, createFolder);
router.get("/", authMiddleware, getFolders);
router.get("/:id", authMiddleware, getFolderContents);
router.patch("/:id", authMiddleware, renameFolder);
router.delete("/:id", authMiddleware, deleteFolder);

module.exports = router;
