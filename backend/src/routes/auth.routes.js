const express = require("express");
const router = express.Router();
const {
  register,
  login,
  me,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  sendOtp
} = require("../controllers/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/send-otp', sendOtp)


module.exports = router;
