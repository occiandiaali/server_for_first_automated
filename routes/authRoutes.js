const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const roleMiddleware = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ REGISTER USER
router.post(
  "/register",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const { username, email, password, role } = req.body;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword,
        role,
      });

      await user.save();

      res.status(201).json({ message: "User Registered Successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error Registering the user", error });
    }
  }
);

// ✅ LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // set to true in production with HTTPS
      sameSite: "None",
      maxAge: 3600000, // 1 hour
    });

    res.json({
      message: "Login successful",
      user: {
        username: user.username,
        role: user.role,
        userId: user._id,
      },
    });
  } catch (error) {
    console.error("🚨 Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// ✅ CHECK AUTH STATUS
router.get("/check", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      authenticated: true,
      user: {
        username: decoded.username,
        role: decoded.role,
      },
    });
  } catch (error) {
    res.status(401).json({ authenticated: false });
  }
});

// ✅ LOGOUT USER
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // match login cookie settings
    sameSite: "None",
  });

  res.json({ message: "Logged out successfully" });
});

module.exports = router;
