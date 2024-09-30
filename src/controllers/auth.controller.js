const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const sendResponse = require("../config/sendResponse");
const adminUsernames = require("../utils/adminUsernames");

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return sendResponse(res, 400, "Username and password are required");
    }

    if (typeof username !== "string" || typeof password !== "string") {
      return sendResponse(res, 400, "Invalid Username or password");
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return sendResponse(res, 400, "User already exists");
    }

    let isAdmin = false;
    if (adminUsernames.includes(username)) {
      isAdmin = true;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      password: hashedPassword,
      isAdmin,
    });
    await user.save();
    return sendResponse(res, 201, "User created");
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, "Internal Server Error");
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return sendResponse(res, 400, "Username and password are required");
    }

    if (typeof username !== "string" || typeof password !== "string") {
      return sendResponse(res, 400, "Invalid Username or password");
    }
    const user = await User.findOne({ username });
    if (!user) {
      return sendResponse(res, 400, "Invalid Username or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 400, "Invalid Username or password");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return sendResponse(res, 200, "Login successful");
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, "Internal Server Error");
  }
};

const logoutUser = (req, res) => {
  // Clear the JWT token cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only use "secure" in production
    sameSite: "none",
  });
  // Send a success message
  res.status(200).json({ message: "Logout successful" });
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
