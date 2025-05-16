const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async function (req, res, next) {
  try {
    console.log('=== Auth Middleware Start ===');
    console.log('Headers:', req.headers);
    
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No Bearer token found');
      return res.status(401).json({ 
        success: false,
        message: "No Bearer token found in Authorization header" 
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token ? 'Token found' : 'No token');

    try {
      // Verify token
      console.log('Verifying token...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) {
        console.log('User not found for token');
        return res.status(401).json({ 
          success: false,
          message: "User not found" 
        });
      }

      // Attach user data to request
      req.user = {
        userId: user._id.toString(),
        role: user.role
      };
      console.log('Attached user data:', req.user);

      next();
    } catch (jwtError) {
      console.log('JWT Verification failed:', jwtError.message);
      return res.status(403).json({ 
        success: false,
        message: "Invalid token",
        error: jwtError.message 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  } finally {
    console.log('=== Auth Middleware End ===');
  }
};
