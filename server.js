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

// Debug middleware
app.use((req, res, next) => {
  console.log('\n=== Request Debug ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Base URL:', req.baseUrl);
  console.log('Original URL:', req.originalUrl);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('===================\n');
  next();
});

// Middleware Setup
app.use(cors({
  origin: '*', // Allow all origins for testing
  credentials: true,
  exposedHeaders: ['Authorization']
}));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB with debug mode
mongoose.set('debug', { 
  color: true,
  shell: true 
});

// Add connection error handler
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

// Connect with more detailed options
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  heartbeatFrequencyMS: 2000,
  retryWrites: true,
  w: 'majority',
  family: 4
})
  .then(async () => {
    console.log("\n=== MongoDB Connection Success ===");
    console.log("MongoDB connected successfully");
    console.log("Connection state:", mongoose.connection.readyState);
    console.log("Database name:", mongoose.connection.name);
    console.log("Database host:", mongoose.connection.host);
    
    // Log database info
    const db = mongoose.connection.db;
    try {
      const collections = await db.listCollections().toArray();
      console.log('\nAvailable collections:', collections.map(c => c.name));
      console.log("=================================\n");
    } catch (err) {
      console.error('Error checking database:', err);
    }
  })
  .catch((err) => {
    console.error("\n=== MongoDB Connection Error ===");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    if (err.reason) {
      console.error("Error reason:", err.reason);
    }
    console.error("===============================\n");
    process.exit(1); // Exit if we can't connect to database
  });

// Mount routes with debugging
console.log('\n=== Mounting Routes ===');

// Auth routes
app.use("/api/v1", (req, res, next) => {
  console.log('Auth route hit:', req.path);
  next();
}, authRoutes);

// User routes
app.use("/api/v1/users", (req, res, next) => {
  console.log('User route hit:', req.path);
  next();
}, userRoutes);


// Event routes
app.use("/api/v1/events", (req, res, next) => {
  console.log('Event route hit:', req.path);
  next();
}, eventRoutes);

// Booking routes
app.use("/api/v1/bookings", (req, res, next) => {
  console.log('Booking route hit:', req.path);
  next();
}, bookingRoutes);

console.log('Routes mounted:');
console.log('- /api/v1/*');
console.log('- /api/v1/users/*');
console.log('- /api/v1/events/*');
console.log('- /api/v1/bookings/*');
console.log('===================\n');

// Error handling middleware
app.use(errorHandler);

// Handle 404 routes
app.use((req, res) => {
  console.log('404 Not Found:', req.path);
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n=== Server Started ===`);
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log(`===================\n`);
});