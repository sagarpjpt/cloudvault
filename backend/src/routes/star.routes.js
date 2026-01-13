const express = require("express");
const router = express.Router();

const {
  starResource,
  unstarResource,
  getStarred,
} = require("../controllers/star.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, starResource);
router.delete("/", authMiddleware, unstarResource);
router.get("/", authMiddleware, getStarred);

module.exports = router;
