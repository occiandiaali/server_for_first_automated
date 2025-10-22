const express = require("express");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to User Profile", user: req.user });
});

router.post("/storefront", async (req, res) => {});
router.get("/storefront", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to Storefront", user: req.user });
});

module.exports = router;
