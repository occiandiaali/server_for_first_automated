const express = require("express");
const Archive = require("../models/Archive");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to User Profile", user: req.user });
});

router.post("/storefront", async (req, res) => {
  const order = new Order(req.body);
  try {
    await order.save();
    res.status(201).send(order);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/storefront", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

router.delete("/storefront/:id", async (req, res) => {
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

router.post("/archive", async (req, res) => {
  const { itemId } = req.body;

  try {
    const item = await Order.findById(itemId);
    if (!item) return res.status(404).json({ message: "Order not found" });

    // Optional: remove _id to avoid duplicate key error
    const { _id, ...itemData } = item.toObject();

    const newTargetItem = new Archive(itemData);
    await newTargetItem.save();

    res.status(200).json({ message: "Item archived successfully" });
  } catch (error) {
    console.error("Error archiving item:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
