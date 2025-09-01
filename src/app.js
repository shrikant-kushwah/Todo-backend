const express = require("express")
const app = express()
require("dotenv").config()
const mongoose = require("mongoose")
const todoRouter = require("./Routes/todoRoutes")
const { router: userRouter } = require("./Routes/userRoutes")
const cors = require("cors")
const cookieParser = require("cookie-parser")




mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected")
    app.listen(process.env.PORT, () => {
      console.log("Server is Running on " + process.env.PORT)
    })
  })
  .catch(() => {
    console.log("Failed")
  })


app.use(cors({credentials:true, origin:"http://localhost:5173"}))
app.use(express.json())
app.use(cookieParser())
app.use("/api", todoRouter)
app.use("/api", userRouter)