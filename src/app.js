const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

//Routers
const todoRouter = require("./Routes/todoRoutes");
const { router: userRouter } = require("./Routes/userRoutes");

const app = express();

//Middlewares 
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://todo-frontend-six-henna.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

//API Routes
app.use("/api", todoRouter);
app.use("/api", userRouter);

//Database Connection 
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
};

//Local Development
if (require.main === module) {
  connectDB().then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  });
} else {
  //Vercel Mode
  connectDB().then(() => {
    console.log("DB connected (Vercel)");
  });
}

module.exports = app;
