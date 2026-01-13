const crypto = require("crypto");
const publicLinkModel = require("../models/publicLink.model");

// CREATE PUBLIC LINK
exports.createPublicLink = async (req, res) => {
  try {
    const { resourceType, resourceId, role, expiresAt, password } = req.body;
    const createdBy = req.user.id;

    if (!resourceType || !resourceId) {
      return res.status(400).json({
        success: false,
        message: "Missing fields"
      });
    }

    const token = crypto.randomUUID();

    const result = await publicLinkModel.createPublicLink({
      resourceType,
      resourceId,
      token,
      role: role || "VIEWER",
      password: password || null,
      expiresAt: expiresAt || null,
      createdBy
    });

    res.status(201).json({
      success: true,
      data: {
        link: `/public/${token}`,
        expiresAt: result.rows[0].expires_at
      }
    });

  } catch (err) {
    console.error("PUBLIC LINK ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ACCESS VIA PUBLIC LINK
exports.accessPublicLink = async (req, res) => {
  try {
    const token = req.params.token;
    const password = req.body?.password || null;

    const result = await publicLinkModel.getByToken(token);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid link"
      });
    }

    const link = result.rows[0];

    if (link.expires_at && new Date() > link.expires_at) {
      return res.status(410).json({
        success: false,
        message: "Link expired"
      });
    }

    if (link.password && link.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        resourceType: link.resource_type,
        resourceId: link.resource_id,
        role: link.role
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
