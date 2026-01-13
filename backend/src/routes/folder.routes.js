const express = require("express");
const router = express.Router();

const {
  createFolder,
  getFolders,
} = require("../controllers/folder.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, createFolder);
router.get("/", authMiddleware, getFolders);

module.exports = router;
