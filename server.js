






const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cookieParser=require('cookie-parser')
const cors = require("cors");

dotenv.config();

const app = express();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection failed:', err));

app.get('/', (req, res) => {
  res.send('API is working!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const courseRouter = require("./Routes/course");
const userRouter = require("./Routes/user");
const authRouter = require("./Routes/auth");
const authenticationMiddleware=require('./middleware/authenticationmiddleware')


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser())

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);




app.use("/api/v1", authRouter);

app.use(authenticationMiddleware);


app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/users", userRouter);

//const db_name = process.env.DB_NAME;
// * Cloud Connection
// const db_url = `mongodb+srv://TestUser:TestPassword@cluster0.lfqod.mongodb.net/${db_name}?retryWrites=true&w=majority`;


/*mongoose
  .connect(db_url)
  .then(() => console.log("mongoDB connected"))
  .catch((e) => {
    console.log(e);
  });

app.use(function (req, res, next) {
  return res.status(404).send("404");
});
app.listen(process.env.PORT, () => console.log("server started")); */
