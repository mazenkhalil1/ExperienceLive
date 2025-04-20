const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authenticationmiddleware");
const authorize = require("../middleware/authorizationmiddleware");

// Admin routes
router.get("/", authMiddleware, authorize(["admin"]), userController.getUsers);

// User profile routes
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);

// User bookings
router.get("/bookings", authMiddleware, userController.getUserBookings);

// Organizer events
router.get("/events", authMiddleware, authorize(["organizer"]), userController.getOrganizerEvents);
router.get("/events/analytics", authMiddleware, authorize(["organizer"]), userController.getEventAnalytics);

// Admin routes for specific users
router.get("/:id", authMiddleware, authorize(["admin"]), userController.getUser);
router.put("/:id", authMiddleware, authorize(["admin"]), userController.updateUserRole);
router.delete("/:id", authMiddleware, authorize(["admin"]), userController.deleteUser);

module.exports = router;