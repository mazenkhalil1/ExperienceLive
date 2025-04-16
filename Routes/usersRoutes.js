const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authenticationMiddleware');
const { authorize } = require('../middleware/authorizationmiddleware');

// Admin user management
router.put('/:id', protect, authorize(['admin']), userController.updateUserRole);
router.delete('/:id', protect, authorize(['admin']), userController.deleteUser);

module.exports = router;
