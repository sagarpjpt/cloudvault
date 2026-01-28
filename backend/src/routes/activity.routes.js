const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  getResourceActivities,
  getUserActivities,
  getActivitiesByDateRange,
} = require("../controllers/activity.controller");

// Get activities for a specific resource (file/folder)
router.get("/:resourceType/:resourceId", getResourceActivities);

// Get user's activities
router.get("/me/activities", authMiddleware, getUserActivities);

// Get activities by date range
router.get("/range/search", authMiddleware, getActivitiesByDateRange);

module.exports = router;
