const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authController = {
  // Test endpoint to check token
  checkToken: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.json({
        decoded,
        user: req.user
      });
    } catch (error) {
      return res.status(403).json({ 
        message: "Invalid token",
        error: error.message 
      });
    }
  },

  // POST /api/v1/login
  login: async (req, res) => {
    try {
      console.log('Login attempt with body:', JSON.stringify(req.body, null, 2));
      
      const { email, password } = req.body;
      
      // Check if email and password are provided
      if (!email || !password) {
        console.log('Missing email or password');
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      // Find user by email
      console.log('Looking for user with email:', email);
      const user = await User.findOne({ email });
      console.log("User password from database:", user?.password);

      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        console.log('No user found with email:', email);
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      console.log('User details:', {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        password: user.password ? '******' : 'No password found'
      });
      
      try {
        // Compare passwords
        console.log('Attempting to compare passwords...');
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', isMatch);

        if (!isMatch) {
          console.log('Password does not match');
          return res.status(400).json({ message: 'Invalid email or password' });
        }
      } catch (error) {
        console.error('Error during password comparison:', error);
        return res.status(500).json({ message: 'Error verifying password' });
      }
      
      // Create token
      console.log('Creating JWT token...');
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      console.log('JWT token created successfully');
      
      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      console.log('Login successful for user:', email);
      
      // Return success response
      return res.status(200).json({ 
        success: true,
        message: "Login successful", 
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  // POST /api/v1/register
  register: async (req, res) => {
    try {
      console.log('=== Register Attempt Start ===');
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      
      const { email, password, name, role } = req.body;
      
      // Validate input
      if (!email || !password || !name) {
        console.log('Validation failed: Missing required fields');
        return res.status(400).json({ 
          success: false,
          message: 'Name, email and password are required' 
        });
      }
      
      try {
        console.log('Checking for existing user...');
        // Check if user already exists with increased timeout
        const existingUser = await User.findOne({ email }).maxTimeMS(15000); // Increased timeout to 15 seconds

        if (existingUser) {
          console.log('User already exists:', email);
          return res.status(409).json({ 
            success: false,
            message: "User already exists" 
          });
        }
        
        console.log('No existing user found, proceeding with registration');
        
        // Hash password
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');
        
        // Create new user
        console.log('Creating new user...');
        const newUser = new User({ 
          email, 
          password: hashedPassword,
          name, 
          role: role || 'user'
        });
        
        console.log('Attempting to save user...');
        // Save with increased timeout
        await newUser.save({ maxTimeMS: 15000 }); // Increased timeout to 15 seconds
        
        console.log('User saved successfully');
        
        // Create token
        console.log('Creating JWT token...');
        const token = jwt.sign(
          { userId: newUser._id, role: newUser.role },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
        console.log('JWT token created');
        
        // Set cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        console.log('=== Register Attempt Success ===');
        return res.status(201).json({ 
          success: true,
          message: "User registered successfully",
          token,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
          }
        });
      } catch (dbError) {
        console.error('Database operation error:', dbError);
        // More specific error handling
        if (dbError.name === 'MongoTimeoutError' || dbError.message.includes('timeout')) {
          return res.status(503).json({ 
            success: false,
            message: "Database is currently unavailable. Please try again later.",
            error: "Database timeout"
          });
        }
        return res.status(500).json({ 
          success: false,
          message: "Database operation failed",
          error: dbError.message 
        });
      }
    } catch (error) {
      console.error('=== Register Attempt Failed ===');
      console.error('Error:', error);
      return res.status(500).json({ 
        success: false,
        message: "Server error", 
        error: error.message 
      });
    }
  },

  // PUT /api/v1/forgetPassword
  forgetPassword: async (req, res) => {
    try {
      const { email } = req.body;
      
      // Validate input
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      // Find user
      const user = await User.findOne({ email }).select('+resetPasswordOTP +resetPasswordOTPExpires');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Save OTP to user document
      user.resetPasswordOTP = otp;
      user.resetPasswordOTPExpires = Date.now() + 600000; // 10 minutes
      await user.save();

      // Return OTP in response (for testing purposes)
      return res.status(200).json({ 
        message: "OTP generated successfully", 
        otp: otp,
        validFor: "10 minutes"
      });
    } catch (err) {
      console.error("Forget password error:", err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  // POST /api/v1/resetPassword
  resetPassword: async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      
      // Validate input
      if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: 'Email, OTP and new password are required' });
      }
      
      // Find user with valid OTP
      const user = await User.findOne({
        email
      }).select('+resetPasswordOTP +resetPasswordOTPExpires');

      if (!user || user.resetPasswordOTP !== otp || user.resetPasswordOTPExpires < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      
      // Update password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpires = undefined;

      await user.save();

      return res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
      console.error("Reset password error:", err);
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  }
};

module.exports = authController;