const User = require("../models/User");
const userModel = require("../models/User");
const courseController = {
    getAllCourses: async (req, res) => {
        try {
          const users = await User.find();
          return res.status(200).json(users);
        } catch (e) {
          return res.status(500).json({ message: e.message });
        }
      },
}
