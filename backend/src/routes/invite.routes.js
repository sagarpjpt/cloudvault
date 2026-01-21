const express = require("express");
const router = express.Router();

const {
  getInviteDetails,
  acceptInvite,
} = require("../controllers/invite.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.get("/:token/details", getInviteDetails);
router.get("/:token", acceptInvite);

module.exports = router;
