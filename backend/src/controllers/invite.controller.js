const inviteModel = require("../models/invite.model");
const shareModel = require("../models/share.model");
const fileModel = require("../models/file.model");
const folderModel = require("../models/folder.model");
const userModel = require("../models/user.model");

exports.getInviteDetails = async (req, res) => {
  try {
    const { token } = req.params;

    const result = await inviteModel.findPendingInviteByToken(token);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired invite",
      });
    }

    const invite = result.rows[0];

    if (new Date(invite.expires_at) < new Date()) {
      return res.status(410).json({
        success: false,
        message: "Invite expired",
      });
    }

    // Get resource name
    let resourceName = "Unknown";
    try {
      if (invite.resource_type === "file") {
        const fileRes = await fileModel.findFileById(invite.resource_id);
        if (fileRes.rows.length > 0) {
          resourceName = fileRes.rows[0].name;
        }
      } else if (invite.resource_type === "folder") {
        const folderRes = await folderModel.getFolderById(invite.resource_id);
        if (folderRes.rows.length > 0) {
          resourceName = folderRes.rows[0].name;
        }
      }
    } catch (err) {
      console.error("Error getting resource name:", err);
    }

    // Get invited by user email
    let invitedByEmail = "Unknown User";
    try {
      const userRes = await userModel.findUserById(invite.invited_by);
      if (userRes.rows.length > 0) {
        invitedByEmail = userRes.rows[0].email;
      }
    } catch (err) {
      console.error("Error getting user email:", err);
    }

    res.status(200).json({
      success: true,
      data: {
        token,
        resourceType: invite.resource_type,
        resourceId: invite.resource_id,
        resourceName,
        role: invite.role,
        invitedBy: invitedByEmail,
        expiresAt: invite.expires_at,
      },
    });
  } catch (err) {
    console.error("GET INVITE DETAILS ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const userId = req?.user?.id;

    const result = await inviteModel.findPendingInviteByToken(token);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired invite",
      });
    }

    const invite = result.rows[0];

    if (new Date(invite.expires_at) < new Date()) {
      return res.status(410).json({
        success: false,
        message: "Invite expired",
      });
    }

    // User not logged in → redirect to register
    if (!userId) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/api/auth/register?invite=${token}`,
      );
    }

    // Create real share
    await shareModel.createShare({
      resourceType: invite.resource_type,
      resourceId: invite.resource_id,
      sharedWith: userId,
      role: invite.role,
      sharedBy: invite.invited_by,
    });

    // Delete pending invite
    await inviteModel.deletePendingInviteById(invite.id);

    // Redirect to resource
    return res.redirect(
      `${process.env.FRONTEND_URL}/api/shares/${invite.resource_type}/${invite.resource_id}`,
    );
  } catch (err) {
    if (err.code === "23505") {
      // already accepted / already shared
      return res.redirect(`${process.env.FRONTEND_URL}/shared`);
    }

    console.error("INVITE ACCEPT ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
