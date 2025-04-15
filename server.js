
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
//const cookieParser=require('cookie-parser')

dotenv.config();

const app = express();
mongoose.connect(process.env.MONGO_URI, {
  //useNewUrlParser: true,
 // useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection failed:', err));

const userRouter = require("./Routes/usersRoutes");
const authRoutes = require("./Routes/authRoutes");


app.use(express.json());

//app.use(cookieParser())
app.use(authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));