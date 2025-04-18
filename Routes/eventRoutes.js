const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const authMiddleware = require("../middleware/authenticationmiddleware");
const authorize = require("../middleware/authorizationmiddleware");

// Public routes
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEvent);

// Organizer routes
router.post("/", authMiddleware, authorize(["organizer"]), eventController.createEvent);
router.put("/:id", authMiddleware, authorize(["organizer"]), eventController.updateEvent);
router.delete("/:id", authMiddleware, authorize(["organizer"]), eventController.deleteEvent);

// Admin routes
router.put("/:id/status", authMiddleware, authorize(["admin"]), eventController.updateEventStatus);

module.exports = router;