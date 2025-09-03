const express = require("express")
const router = express.Router()
const { User } = require("../Models/userSchema")
const bcrypt = require("bcrypt")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const { isLoggedIn } = require("../Middlewares/isLoggedIn")

// Get logged-in user data (protected route)
router.get("/user/get-user-data", isLoggedIn, (req, res) => {
  try {
    res.status(200).json({ data:req.user })
  } catch (error) {
    res.status(500).json({ err: error.message })
  }
})

// Signup new user
router.post("/user/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, email, number, gender, dateOfBirth, password } = req.body

    // 1. Validation → all fields required
    if (!firstName || !lastName || !username || !email || !number || !gender || !password || !dateOfBirth) {
      return res.status(400).json({ error: "Please enter all the required fields" })
    }

    // 2. Check if username or email already exists
    const foundUser = await User.findOne({ $or: [{ username }, { email }] })
    if (foundUser) {
      return res.status(409).json({ error: "User already exists" })
    }

    // 3. Check password strength
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ error: "Please enter a strong password" })
    }

    // 4. Validate date format
    if (!validator.isDate(dateOfBirth)) {
      return res.status(400).json({ error: "Please enter a valid date" })
    }

    // 5. Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10)

    // 6. Create user
    const createdUser = await User.create({
      firstName, lastName, username, email, number, gender, dateOfBirth, password: hashedPassword
    })

    // 7. Hide password in response
    const userResponse = createdUser.toObject()
    delete userResponse.password

    res.status(201).json({ msg: "User registered successfully", data: userResponse })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Login user
router.post("/user/login", async (req, res) => {
  try {
    const { username, password } = req.body

    // 1. Validation
    if (!username || !password) {
      return res.status(400).json({ error: "Please enter all the fields" })
    }

    // 2. Find user
    const foundUser = await User.findOne({ username }).populate("todos")
    if (!foundUser) {
      return res.status(404).json({ error: "User does not exist" })
    }

    // 3. Compare password
    const flag = await bcrypt.compare(password, foundUser.password)
    if (!flag) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // 4. Generate JWT token (expires in 1 day)
    const token = jwt.sign({ _id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

    // 5. Send cookie securely
    res.status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,              // prevents XSS
        sameSite: "none",
        secure: true // only for HTTPS
      })
      .json({ msg: "User logged in", data: foundUser })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Logout user (clear cookie)
router.post("/user/logout", (req, res) => {
  res.status(200)
    .cookie("token", "", { expires: new Date(0) }) // expire cookie immediately
    .json({ msg: "User logged out" })
})

module.exports = { router }
