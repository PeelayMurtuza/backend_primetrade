const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Protect routes and optionally restrict by role
exports.authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      // 1. Get token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Not authorized" });
      }

      const token = authHeader.split(" ")[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Fetch user from DB
      const user = await User.findById(decoded.id).select("id role email");
      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      // 4. Attach user to request
      req.user = {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
      };

      // 5. Role check (if roles array provided)
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      next(); //allow route to continue
    } catch (error) {
      return res.status(401).json({ success: false, message: "Token invalid or expired" });
    }
  };
};
