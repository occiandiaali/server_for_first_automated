const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemName: { type: String },
  qty: { type: Number, default: 1 },
  itemPrice: { type: Number },
  checked: { type: Boolean, default: false },
  // createdAt: { type: Date, default: Date.now }, // Sets current date as default
});

module.exports = mongoose.model("Item", itemSchema);
