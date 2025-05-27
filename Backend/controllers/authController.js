const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

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
      const user = await User.findOne({ email }).select('+mfaEnabled +mfaOTP +mfaOTPExpires');
      console.log("User password from database:", user?.password);

      console.log('User found:', user ? 'Yes' : 'No');
      console.log('MFA Enabled for user:', user?.mfaEnabled);
      
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

        // Check if MFA is enabled
        if (user.mfaEnabled) {
          // Return a response indicating MFA is required
          return res.status(200).json({
            success: true,
            message: "MFA required",
            mfaRequired: true,
            userId: user._id // Send userId for subsequent MFA steps
          });
        }
      
        // If MFA is not enabled, proceed with login (create token, set cookie, etc.)
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
      
      const { email, password, name, role ,profilePicture } = req.body;
      
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
          role: role || 'user',
          profilePicture: profilePicture || ""
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
            role: newUser.role,
            profilePicture: newUser.profilePicture
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

  // POST /auth/send-otp
  sendMfaOtp: async (req, res) => {
    try {
      const { userId } = req.body;

      // Find the user by ID and select MFA fields
      const user = await User.findById(userId).select('+mfaOTP +mfaOTPExpires +mfaEnabled');

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }

      if (!user.mfaEnabled) {
         return res.status(400).json({ success: false, message: "MFA is not enabled for this user." });
      }

      // Generate 6-digit OTP
      const mfaOTP = Math.floor(100000 + Math.random() * 900000).toString();

      // Store OTP and expiry in user document
      user.mfaOTP = mfaOTP;
      user.mfaOTPExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
      await user.save();

      // Send email with OTP
      try {
        await sendEmail({
          email: user.email,
          subject: 'Your MFA Code',
          message: `Your MFA code is: ${mfaOTP}. It is valid for 10 minutes.`
        });
        console.log('MFA OTP email sent successfully for user:', user.email);
        return res.status(200).json({ success: true, message: "MFA OTP sent to your email." });
      } catch (emailError) {
        console.error('Error sending MFA OTP email:', emailError);
        return res.status(500).json({ success: false, message: "Error sending MFA OTP email." });
      }

    } catch (err) {
      console.error('Error in sendMfaOtp:', err);
      return res.status(500).json({ success: false, message: "Server error." });
    }
  },

  // POST /api/v1/verify-mfa
  verifyMfa: async (req, res) => {
    try {
      const { userId, mfaCode } = req.body;

      // Find the user by ID
      const user = await User.findById(userId).select('+mfaOTP +mfaOTPExpires');

      // Check if user exists, MFA code matches, and OTP is not expired
      if (!user || user.mfaOTP !== mfaCode || user.mfaOTPExpires < Date.now()) {
        return res.status(400).json({ success: false, message: "Invalid or expired MFA code" });
      }

      // Clear MFA OTP fields after successful verification
      user.mfaOTP = undefined;
      user.mfaOTPExpires = undefined;
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      return res.status(200).json({
        success: true,
        message: "MFA verification successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

    } catch (err) {
      console.error('MFA verification error:', err);
      return res.status(500).json({ message: "Server error", error: err.message });
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

      // Send email with OTP
      const message = `Your password reset OTP is: ${otp}. It is valid for 10 minutes.`;

      try {
        await sendEmail({
          email: user.email,
          subject: 'Password Reset OTP',
          message
        });
        console.log('Password reset OTP email sent successfully for user:', user.email);

        // Return OTP in response (for testing purposes - remove in production)
        return res.status(200).json({ 
          success: true,
          message: "OTP generated and email sent successfully", 
          otp: otp, // Keep for testing
          validFor: "10 minutes"
        });
      } catch (emailError) {
        console.error('Error sending password reset OTP email:', emailError);
        // Consider clearing OTP fields on email send failure if it's critical the user receives the email
        // user.resetPasswordOTP = undefined;
        // user.resetPasswordOTPExpires = undefined;
        // await user.save();
        return res.status(500).json({ success: false, message: "Error sending password reset email." });
      }
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
  },

  // POST /api/v1/logout
  logOut: async (req, res) => {
    try {
      // Clear the token cookie
      res.clearCookie("token");
      return res.status(200).json({ 
        success: true,
        message: "Logged out successfully" 
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ 
        success: false,
        message: "Server error", 
        error: error.message 
      });
    }
  }
};

module.exports = authController;
