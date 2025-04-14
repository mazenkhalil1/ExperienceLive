const verifyOrganizer = (req, res, next) => {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Access denied. Organizer only.' });
    }
    next();
 
  const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ Verifies JWT and sets req.user
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = { id: user._id, role: user.role }; // ⬅️ this is what sets req.user
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ Checks if user is an organizer
const verifyOrganizer = (req, res, next) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Only organizers can access this route.' });
  }
  next();
};

module.exports = { verifyToken, verifyOrganizer };
};