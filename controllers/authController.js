// controllers/authController.js
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

exports.forgetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Forget password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
