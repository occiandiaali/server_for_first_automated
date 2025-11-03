const express = require("express");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const User = require("../models/User");
const Item = require("../models/Item");
const Archive = require("../models/Archive");
const YearlyRevenue = require("../models/YearlyRevenue");

const router = express.Router();

// Logging user info
//console.log(`🔐 ${req.user.username} accessed ${req.originalUrl}`);

router.get(
  "/archive",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const archives = await Archive.find();
      res.json(archives);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch archives" });
    }
  }
);
// ✅ Archive order
router.post(
  "/archive",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  async (req, res) => {
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
  }
);

// ✅ YoY revenue array, by month
router.post(
  "/year-revenue",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const yearly = new YearlyRevenue({
        revenueArray: req.body.monthlyTotals,
        year: new Date().getFullYear().toString(),
      });
      await yearly.save();
      res.status(200).json({ message: "Revenues posted successfully" });
    } catch (error) {
      console.error(error);
    }
  }
);

router.get(
  "/year-revenue",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const yearly = await YearlyRevenue.find();
      res.json(yearly);
      // if (yearly.year === new Date().getFullYear().toString()) {
      //   res.json(yearly.data)
      // }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch yearly revenues" });
    }
  }
);

router.get(
  "/staff",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const staff = await User.find();
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch staff" });
    }
  }
);

router.put(
  "/staff/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const updatedStaff = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedStaff);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating this staff..", error });
    }
  }
);
router.delete(
  "/staff/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const deletedStaff = await User.findByIdAndDelete(req.params.id);
      res.json(deletedStaff);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error deleting this staff entry", error });
    }
  }
);
router.post(
  "/items",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const { itemName, qty, itemPrice, checked } = req.body;
      const item = new Item({ itemName, qty, itemPrice, checked });
      await item.save();
      res.status(201).json({ message: "Item successfully added!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding this item..", error });
    }
  }
);

router.put(
  "/items/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const updatedItem = await Item.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error editing this item..", error });
    }
  }
);

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

router.get(
  "/customers",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({ message: "Welcome to Customers Dashboard", user: req.user });
  }
);

module.exports = router;
