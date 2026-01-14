const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userResult = await userModel.findUserById(decoded.userId);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = userResult.rows[0];

    // extra safety: block unverified users
    if (user.email_verified === false) {
      return res.status(403).json({
        success: false,
        message: "Email not verified",
      });
    }

    req.user = {
      id: user.id,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
