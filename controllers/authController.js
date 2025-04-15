const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  
      try {
        const { email, password, name, role, age } = req.body;
  
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ message: "User already exists" });
        }
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Create a new user
        const newUser = new User({
          email,
          password: hashedPassword,
          name,
          role,
        });
  
        // Save the user to the database
        await newUser.save();
  
        res.status(201).json({ message: "User registered successfully" });
      } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
      }
    }
  


const login = async (req, res) => {
  // your login code here
};

module.exports = { register, login };
