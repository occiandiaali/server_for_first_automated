const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const User = require("../models/User");
const Item = require("../models/Item");

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({ message: "Welcome to Dashboard", user: req.user });
  }
);

router.get(
  "/staff",
  // authMiddleware,
  // roleMiddleware("admin"),
  async (req, res) => {
    try {
      const staff = await User.find();
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch staff" });
    }
  }
);
router.post("/items", async (req, res) => {
  try {
    const { itemName, qty, itemPrice, checked } = req.body;
    const item = new Item({ itemName, qty, itemPrice, checked });
    await item.save();
    res.status(201).json({ message: "Item successfully added!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding this item..", error });
  }
});

router.get(
  "/items",
  // authMiddleware,
  // roleMiddleware("admin"),
  async (req, res) => {
    try {
      const items = await Item.find();
      res.json(items);
      console.log("get/items", items);
      //res.json({ message: "Welcome to Items Dashboard", user: req.user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  }
);
router.get(
  "/customers",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({ message: "Welcome to Customers Dashboard", user: req.user });
  }
);

module.exports = router;
