const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to User Profile", user: req.user });
});
router.get("/storefront", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to Storefront", user: req.user });
});

module.exports = router;
