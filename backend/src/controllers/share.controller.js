const shareModel = require("../models/share.model");
const userModel = require("../models/user.model");
const sendEmail = require("../utils/sendEmail");

// SHARE FILE OR FOLDER
exports.shareResource = async (req, res) => {
  try {
    const { resourceType, resourceId, sharedWith, role } = req.body;
    const sharedBy = req.user.id;

    if (!resourceType || !resourceId || !sharedWith || !role) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!["file", "folder"].includes(resourceType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource type",
      });
    }

    if (!["VIEWER", "EDITOR"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const result = await shareModel.createShare({
      resourceType,
      resourceId,
      sharedWith,
      role,
      sharedBy,
    });

    // send share notification email
    try {
      const senderResult = await userModel.findUserById(sharedBy);
      const receiverResult = await userModel.findUserById(sharedWith);

      if (senderResult.rows.length > 0 && receiverResult.rows.length > 0) {
        const senderEmail = senderResult.rows[0].email;
        const receiverEmail = receiverResult.rows[0].email;

        await sendEmail(
          receiverEmail,
          "A resource has been shared with you",
          `
        <p>You have been given <strong>${role}</strong> access to a ${resourceType}.</p>
        <p>Shared by: ${senderEmail}</p>
        <p>Please log in to view it.</p>
      `
        );
      }
    } catch (emailError) {
      // email failure should not break sharing
      console.error("Share email failed:", emailError.message);
    }

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      // unique constraint violation
      return res.status(409).json({
        success: false,
        message: "Resource already shared with this user",
      });
    }

    console.error("SHARE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
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
