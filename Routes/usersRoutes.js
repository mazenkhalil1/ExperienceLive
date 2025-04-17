const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authenticationmiddleware");
const authorize = require("../middleware/authorizationmiddleware");

// Admin routes
router.get("/users", authMiddleware, authorize(["admin"]), userController.getUsers);
router.get("/users/:id", authMiddleware, authorize(["admin"]), userController.getUser);
router.put("/users/:id", authMiddleware, authorize(["admin"]), userController.updateUserRole);
router.delete("/users/:id", authMiddleware, authorize(["admin"]), userController.deleteUser);

// User profile routes
router.get("/users/profile", authMiddleware, userController.getProfile);
router.put("/users/profile", authMiddleware, userController.updateProfile);

// User bookings
router.get("/users/bookings", authMiddleware, userController.getUserBookings);

// Organizer events
router.get("/users/events", authMiddleware, authorize(["organizer"]), userController.getOrganizerEvents);
router.get("/users/events/analytics", authMiddleware, authorize(["organizer"]), userController.getEventAnalytics);

module.exports = router;