const express = require("express"); // Import Express framework
const mongoose = require("mongoose"); // Import Mongoose for MongoDB interaction
const dotenv = require("dotenv"); // Import dotenv to manage environment variables
const cookieParser = require("cookie-parser"); // Middleware to parse cookies
const cors = require("cors"); // Enable CORS for cross-origin requests
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./Routes/authRoutes"); // Routes for authentication
const userRoutes = require("./Routes/usersRoutes"); // Routes for user operations
const eventRoutes = require("./Routes/eventRoutes"); // Routes for event operations
const bookingRoutes = require("./Routes/bookingRoutes"); // Routes for booking operations

dotenv.config();
const app = express();

// Middleware Setup
app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// Use API Routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/bookings", bookingRoutes);

// Error handling middleware
app.use(errorHandler);

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));