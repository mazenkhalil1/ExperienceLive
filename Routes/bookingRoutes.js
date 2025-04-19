const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authenticationmiddleware");

// User routes
router.post("/", authMiddleware, bookingController.createBooking);
router.get("/:id", authMiddleware, bookingController.getBooking);
router.delete("/:id", authMiddleware, bookingController.cancelBooking);

module.exports = router;
