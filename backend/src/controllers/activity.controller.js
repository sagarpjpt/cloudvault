const activityModel = require("../models/activity.model");

// GET RESOURCE ACTIVITIES
exports.getResourceActivities = async (req, res) => {
  try {
    const { resourceType, resourceId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    if (!resourceType || !resourceId) {
      return res.status(400).json({
        success: false,
        message: "resourceType and resourceId are required",
      });
    }

    const result = await activityModel.getResourceActivities(
      resourceType,
      resourceId,
      parseInt(limit),
      parseInt(offset),
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("GET RESOURCE ACTIVITIES ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET USER ACTIVITIES
exports.getUserActivities = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 100, offset = 0 } = req.query;

    const result = await activityModel.getUserFileAndFolderActivities(
      userId,
      parseInt(limit),
      parseInt(offset),
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("GET USER ACTIVITIES ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET DATE RANGE ACTIVITIES (Admin only - optional)
exports.getActivitiesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate are required",
      });
    }

    const result = await activityModel.getActivitiesByDateRange(
      new Date(startDate),
      new Date(endDate),
      100,
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("GET ACTIVITIES BY DATE RANGE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
