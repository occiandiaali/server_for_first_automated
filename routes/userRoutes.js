const express = require("express");
const Order = require("../models/Order");
const Archive = require("../models/Archive");
const Item = require("../models/Item");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// ✅ Protected route: user profile
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to User Profile", user: req.user });
});

// ✅ Create order
router.post("/storefront", authMiddleware, async (req, res) => {
  const order = new Order(req.body);
  try {
    await order.save();
    res.status(201).send(order);
  } catch (error) {
    res.status(400).send(error);
  }
});

// ✅ Get all orders
router.get("/storefront", authMiddleware, async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// ✅ Delete order
router.delete("/storefront/:id", authMiddleware, async (req, res) => {
  try {
    const result = await Order.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).send("Order not found");
    }
    res.send("Order now completed.");
  } catch (error) {
    res.status(500).send("Error deleting order");
  }
});

// Necessary for getting list of garments in "/items"
router.get(
  "/items",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  async (req, res) => {
    try {
      const items = await Item.find();
      res.json(items); // ✅ Return actual items
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  }
);

// ✅ Archive order
router.post("/archive", authMiddleware, async (req, res) => {
  const { itemId } = req.body;
  const currentMonth = new Date().getMonth();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[currentMonth];

  try {
    const item = await Order.findById(itemId);
    if (!item) return res.status(404).json({ message: "Order not found" });

    const { _id, ...itemData } = item.toObject();
    const archiveItem = new Archive({ title: monthName, content: itemData });
    await archiveItem.save();

    res.status(200).json({ message: "Item archived successfully" });
  } catch (error) {
    console.error("Error archiving item:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
