const jwt = require("jsonwebtoken");

// Protect routes and optionally restrict by role
exports.authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      // 1. Get token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer "))
        return res.status(401).json({ success: false, message: "Not authorized" });

      const token = authHeader.split(" ")[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Attach user info to request
      req.user = decoded;

      // 4. Check role if roles array provided
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      next(); // allow route to continue
    } catch (error) {
      return res.status(401).json({ success: false, message: "Token invalid or expired" });
    }
  };
};
