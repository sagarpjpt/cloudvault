const express = require("express");
const router = express.Router();

const { shareResource, getSharedWithMe } = require("../controllers/share.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, shareResource);
router.get("/me", authMiddleware, getSharedWithMe);

module.exports = router;
