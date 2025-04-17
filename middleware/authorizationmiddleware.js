/**
 * Authorization middleware to check if user has required role
 * @param {string[]} roles - Array of allowed roles
 */
module.exports = function (roles) {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const userRole = req.user.role;
      
      if (!roles.includes(userRole)) {
        return res.status(403).json({ 
          message: "Unauthorized access",
          required: roles,
          current: userRole
        });
      }
      
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ message: "Server error" });
    }
  };
};