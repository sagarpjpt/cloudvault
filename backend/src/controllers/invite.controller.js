const inviteModel = require("../models/invite.model");
const shareModel = require('../models/share.model')

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
        `${process.env.FRONTEND_URL}/api/auth/register?invite=${token}`
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
      `${process.env.FRONTEND_URL}/api/shares/${invite.resource_type}/${invite.resource_id}`
    );
  } catch (err) {
    if (err.code === "23505") {
      // already accepted / already shared
      return res.redirect(
        `${process.env.FRONTEND_URL}/shared`
      );
    }

    console.error("INVITE ACCEPT ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
