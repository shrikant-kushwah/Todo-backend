const jwt = require("jsonwebtoken")
const {User} = require("../Models/userSchema")



async function isLoggedIn(req, res, next) {
  try {
    const { token } = req.cookies
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) //{_id:fghjkbnjm}
    const foundUser = await User.findById(decodedToken._id).populate("todos")

    if (!foundUser) {
      throw new Error("Please Log in")
    }
    req.userId = decodedToken._id
    req.user = foundUser
    next()
  } catch (error) {
    res.status(400).json({ error: "Please Log in" })
  }
}



module.exports = {
  isLoggedIn
}