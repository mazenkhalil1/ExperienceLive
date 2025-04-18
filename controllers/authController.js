const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authController = {
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
      const user = await User.findOne({ email }).select('+password');
      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        console.log('No user found with email:', email);
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      console.log('User details:', {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      });
      
      try {
        // Compare passwords
        console.log('Attempting to compare passwords...');
        const isMatch = await user.comparePassword(password);
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
      console.log('Register attempt with body:', req.body);
      
      const { email, password, name, role } = req.body;
      
      // Validate input
      if (!email || !password || !name) {
        return res.status(400).json({ message: 'Name, email and password are required' });
      }
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('User already exists:', email);
        return res.status(409).json({ message: "User already exists" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create new user
      const newUser = new User({ 
        email, 
        password: hashedPassword,
        name, 
        role: role || 'user'
      });
      
      await newUser.save();
      console.log('User registered successfully:', email);
      
      // Create token
      const token = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
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
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
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
