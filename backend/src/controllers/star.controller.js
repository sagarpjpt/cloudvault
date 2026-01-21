const starModel = require("../models/star.model");

// STAR resource
exports.starResource = async (req, res) => {
  try {
    const userId = req.user.id;
    const { resourceType, resourceId } = req.body;

    if (!resourceType || !resourceId) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }

    if (!["file", "folder"].includes(resourceType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource type",
      });
    }

    await starModel.addStar({ userId, resourceType, resourceId });

    res.status(201).json({
      success: true,
      message: "Star added",
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Already starred",
      });
    }

    console.error("STAR ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// UNSTAR resource
exports.unstarResource = async (req, res) => {
  try {
    const userId = req.user.id;
    const { resourceType, resourceId } = req.body;

    await starModel.removeStar({ userId, resourceType, resourceId });

    res.status(200).json({
      success: true,
      message: "Star removed",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET STARRED ITEMS
exports.getStarred = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await starModel.getStarred(userId);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("GET STARRED ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
