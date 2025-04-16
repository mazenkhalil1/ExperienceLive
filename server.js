
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const userRouter = require("./Routes/usersRoutes");
const authRoutes = require("./Routes/authRoutes");
//const cookieParser=require('cookie-parser')

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  //useNewUrlParser: true,
 // useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection failed:', err));






//app.use(cookieParser())
app.use('/api/v1',authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));