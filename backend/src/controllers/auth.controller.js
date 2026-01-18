const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const inviteModel = require('../models/invite.model')
const shareModel = require('../models/share.model')
require("dotenv").config();
const { createOtp, verifyOtp } = require("../models/otp.model");
const sendEmail = require("../utils/sendEmail");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userModel.createUser(email, hashedPassword, name);
    const user = result.rows[0];

    /* =====================================================
       AUTO-ACTIVATE PENDING SHARES (SAFE ADDITION)
    ===================================================== */
    const pendingInvites =
      await inviteModel.findPendingInvitesByEmail(user.email);

    for (const invite of pendingInvites.rows) {
      try {
        await shareModel.createShare({
          resourceType: invite.resource_type,
          resourceId: invite.resource_id,
          sharedWith: user.id,
          role: invite.role,
          sharedBy: invite.invited_by,
        });
      } catch (err) {
        // ignore duplicate share safely
        if (err.code !== "23505") {
          throw err;
        }
      }
    }

    // cleanup pending invites
    await inviteModel.deletePendingInvitesByEmail(user.email);
    /* ===================================================== */

    // create email verification OTP (UNCHANGED)
    const otp = await createOtp({
      userId: user.id,
      email: user.email,
      type: "EMAIL_VERIFY",
    });

    // send verification email (UNCHANGED)
    await sendEmail(
      user.email,
      "Verify your email address",
      `
        <h2>Email Verification</h2>
        <p>Your verification OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `
    );

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// RESEND EMAIL VERIFICATION OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // 1. check user exists
    const userResult = await userModel.findUserByEmail(email);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userResult.rows[0];

    // 2. check already verified
    if (user.email_verified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // 3. create new OTP (old one auto-deleted inside model)
    const otp = await createOtp({
      userId: user.id,
      email: user.email,
      type: "EMAIL_VERIFY",
    });

    // 4. send email
    await sendEmail(
      user.email,
      "Verify your email",
      `
        <p>Your verification OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 10 minutes.</p>
      `
    );

    return res.status(200).json({
      success: true,
      message: "Verification OTP sent to email",
    });

  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const userResult = await userModel.findUserByEmail(email);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userResult.rows[0];

    await verifyOtp({
      userId: user.id,
      otp,
      type: "EMAIL_VERIFY",
    });

    await userModel.verifyUserEmail(email);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await userModel.findUserByEmail(email);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // block login if email is not verified
    if (!user.email_verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET CURRENT USER
exports.me = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await userModel.findUserById(userId);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  // clear cookie(that contains jwt toke) if using it else if token sent as res body and stored in client side local storage so just delete it from client sidde
  // i am sending token in res body and recieve at server via auth header
  res.json({ success: true, message: "Logged out successfully" });
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const userResult = await userModel.findUserByEmail(email);

    // Always return success to avoid email enumeration
    if (userResult.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "If the email exists, a reset OTP has been sent",
      });
    }

    const user = userResult.rows[0];

    const otp = await createOtp({
      userId: user.id,
      email: user.email,
      type: "RESET_PASSWORD",
    });

    const reset_url = `${process.env.FRONTEND_URL}/reset-password?email=${email}`

    await sendEmail(
      user.email,
      "Reset your password",
      `
        <h2>Password Reset</h2>
        <p>Your password reset Link:</p>
        <a href="${reset_url}"><h4>click here to reset password</h4></a>
        <p>Your OTP:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `
    );

    return res.status(200).json({
      success: true,
      message: "If the email exists, a reset OTP has been sent",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const userResult = await userModel.findUserByEmail(email);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userResult.rows[0];

    await verifyOtp({
      userId: user.id,
      otp,
      type: "RESET_PASSWORD",
    });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userModel.updateUserPassword(email, hashedPassword);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
