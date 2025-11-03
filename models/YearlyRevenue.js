// models/YearlyRevenue.js
const mongoose = require("mongoose");

const yearlyRevenueSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
    unique: true,
  },
  revenue: {
    type: [Number],
    validate: [(arr) => arr.length === 12, "Revenue must have 12 months"],
  },
});

module.exports = mongoose.model("YearlyRevenue", yearlyRevenueSchema);
