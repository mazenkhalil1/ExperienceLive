const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authenticationmiddleware");
const authorize = require("../middleware/authorizationmiddleware");

// Admin routes
router.get("/", authMiddleware, authorize(["admin"]), userController.getUsers);
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);
router.get("/:id", authMiddleware, authorize(["admin"]), userController.getUser);
router.put("/:id", authMiddleware, authorize(["admin"]), userController.updateUserRole);
router.delete("/:id", authMiddleware, authorize(["admin"]), userController.deleteUser);
router.get("/bookings", authMiddleware, userController.getUserBookings);

// Organizer event routes
router.get("/events", authMiddleware, authorize(["organizer"]), userController.getOrganizerEvents);
router.get("/events/analytics", authMiddleware, authorize(["organizer"]), userController.getEventAnalytics);

module.exports = router;