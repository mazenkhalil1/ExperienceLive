const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authenticationmiddleware");
const authorize = require("../middleware/authorizationmiddleware");



// User routes
router.post("/", authMiddleware, authorize(["user"]), bookingController.createBooking);
router.get("/:id", authMiddleware,authorize(["user"]), bookingController.getBooking);
router.delete("/:id", authMiddleware,authorize(["user"]), bookingController.cancelBooking);

module.exports = router;
