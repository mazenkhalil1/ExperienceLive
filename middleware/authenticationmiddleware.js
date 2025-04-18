const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    // Check for token in cookies or Authorization header
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      // Extract user data and attach to request
      req.user = {
        userId: decoded.userId,
        role: decoded.role
      };
      
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: "Server error" });
  }
};
