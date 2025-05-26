const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const authMiddleware = require("../middleware/authenticationmiddleware");
const authorize = require("../middleware/authorizationmiddleware");
const multer = require('multer');

// Configure multer for handling multipart/form-data
// Using memory storage as we are sending base64 string in frontend
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Public routes (only approved events)
router.get("/", eventController.getEvents);

// Admin routes - must be before /:id to prevent conflict
router.get("/all", authMiddleware, authorize(["admin"]), eventController.getAllEvents);

// Event detail route
router.get("/:id", eventController.getEvent);

// Event Organizer routes
router.post("/", authMiddleware, authorize(["organizer"]), upload.none(), eventController.createEvent);
router.put("/:id", authMiddleware, authorize(["organizer", "admin"]), eventController.updateEvent);
router.delete("/:id", authMiddleware, authorize(["organizer", "admin"]), eventController.deleteEvent);

module.exports = router;