const express = require("express");
const router = express.Router();

const {
  createPublicLink,
  accessPublicLink,
} = require("../controllers/publicLink.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, createPublicLink);

router.post("/:token", accessPublicLink);

module.exports = router;
