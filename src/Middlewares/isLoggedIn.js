const jwt = require("jsonwebtoken");
const { User } = require("../Models/userSchema");

async function isLoggedIn(req, res, next) {
  try {
    const { token } = req.cookies;

    // 400 → No token
    if (!token) {
      return res.status(400).json({ error: "No token, please log in" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // 401 → Invalid/Expired token
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const foundUser = await User.findById(decodedToken._id).populate("todos");
    if (!foundUser) {
      // 404 → User not found
      return res.status(404).json({ error: "User not found, please sign up" });
    }

    // Attach user info for downstream routes
    req.userId = decodedToken._id;
    req.user = foundUser;

    next();
  } catch (error) {
    // 500 → Unexpected server error
    res.status(500).json({ error: "Internal Server Error" });
  }
}
module.exports = { isLoggedIn };