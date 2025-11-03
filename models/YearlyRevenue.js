const mongoose = require("mongoose");

const yearlyRevenueSchema = new mongoose.Schema({
  id: { type: String },
  year: { type: String, required: true },
  revenueArray: { type: [Number], required: true },
});

module.exports = mongoose.model("YearlyRevenue", yearlyRevenueSchema);
