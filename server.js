const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection failed:', err));

// Import routes
const authRoutes = require("./Routes/authRoutes");
const userRoutes = require("./Routes/usersRoutes");

// Use routes
console.log('✅ authRoutes loaded');
app.use('/api/v1', authRoutes);         // /register, /login, /forgot-password
app.use('/api/v1/users', userRoutes);   // /users/:id

// Health check
app.get('/', (req, res) => res.send('API is working!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
