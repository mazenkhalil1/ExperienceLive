const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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
      const user = await User.findOne({ email });
      console.log("User password from database:", user.password);

      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        console.log('No user found with email:', email);
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      console.log("User password from database:", user.password);
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
      const hashedPassword = await bcrypt.hash(password, 10);
      
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
          role: newUser.role,
          password: newUser.password
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
      const { email, newPassword } = req.body;
      
      // Validate input
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      if (!newPassword) {
        return res.status(400).json({ message: 'New password is required' });
      }
      
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = newHashedPassword;
      await user.save();

      return res.status(200).json({ message: "Password reset email sent", user });
    } catch (err) {
        console.error("Forget password error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
  },
};

module.exports = authController;
