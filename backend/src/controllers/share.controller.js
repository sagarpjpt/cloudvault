const shareModel = require("../models/share.model");
const userModel = require("../models/user.model");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const accessModel = require('../models/access.model')

// SHARE FILE OR FOLDER
exports.shareResource = async (req, res) => {
  try {
    const { resourceType, resourceId, email, role } = req.body;
    const sharedBy = req.user.id;

    // 1. Basic validation
    if (!resourceType || !resourceId || !email || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    if (!["file", "folder"].includes(resourceType)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid resource type" });
    }

    if (!["VIEWER", "EDITOR"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const canShare = await accessModel.canEditResource({
      userId: sharedBy,
      resourceType,
      resourceId,
    });

    if (!canShare) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to share this resource",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Find sender
    const sender = await userModel.findUserById(sharedBy);
    if (sender.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (sender.rows[0].email === normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "You cannot share with yourself",
      });
    }

    // 3. Check if email belongs to a registered user
    const receiver = await userModel.findUserByEmail(normalizedEmail);

    // 
    // CASE 1: USER EXISTS
    // 
    if (receiver.rows.length > 0) {
      const receiverId = receiver.rows[0].id;

      const share = await shareModel.createShare({
        resourceType,
        resourceId,
        sharedWith: receiverId,
        role,
        sharedBy,
      });

      // Send email with direct link
      const resourceLink = `${process.env.FRONTEND_URL}/shared/${resourceType}/${resourceId}`;

      await sendEmail(
        normalizedEmail,
        "A resource was shared with you",
        `
          <p><strong>${sender.rows[0].email}</strong> shared a ${resourceType} with you.</p>
          <p>Access level: <b>${role}</b></p>
          <a href="${resourceLink}" style="padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px">
            Open Resource
          </a>
        `,
      );

      return res.status(201).json({
        success: true,
        message: "Resource shared successfully",
        data: share.rows[0],
      });
    }

    // 
    // CASE 2: USER NOT REGISTERED
    // 
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await shareModel.createPendingShare({
      resourceType,
      resourceId,
      email: normalizedEmail,
      role,
      invitedBy: sharedBy,
      token,
      expiresAt,
    });

    const inviteLink = `${process.env.FRONTEND_URL}/invite/${token}`;

    await sendEmail(
      normalizedEmail,
      "You're invited to access a resource",
      `
        <p><strong>${sender.rows[0].email}</strong> shared a ${resourceType} with you.</p>
        <p>Access level: <b>${role}</b></p>
        <p>Create an account to access it:</p>
        <a href="${inviteLink}" style="padding:10px 16px;background:#16a34a;color:#fff;text-decoration:none;border-radius:6px">
          Accept Invitation
        </a>
      `,
    );

    return res.status(200).json({
      success: true,
      message: "Invitation sent successfully",
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Already shared with this user",
      });
    }

    console.error("SHARE ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET RESOURCES SHARED WITH ME
exports.getSharedWithMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await shareModel.getSharedWithUser(userId);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
