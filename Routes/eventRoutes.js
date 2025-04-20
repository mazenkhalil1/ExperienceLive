const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const authMiddleware = require("../middleware/authenticationmiddleware");
const authorize = require("../middleware/authorizationmiddleware");

// Public routes (only approved events)
router.get("/", eventController.getEvents); // Will show only approved events
router.get("/:id", eventController.getEvent); // Will show only if approved

// Admin routes
router.get("/all", authMiddleware, authorize(["admin"]), eventController.getAllEvents); // All events including pending/declined

// Event Organizer routes
router.post("/", authMiddleware, authorize(["organizer"]), eventController.createEvent);
router.put("/:id", authMiddleware, authorize(["organizer", "admin"]), eventController.updateEvent);
router.delete("/:id", authMiddleware, authorize(["organizer", "admin"]), eventController.deleteEvent);

module.exports = router;