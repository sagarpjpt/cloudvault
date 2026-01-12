const jwt = require('jsonwebtoken');
exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // auth Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info to request
    req.user = {
      id: decoded.userId,
    };

    next();
  } catch (err) {
    return res.status(401).json({ success: false,message: "Invalid token" });
  }
};
