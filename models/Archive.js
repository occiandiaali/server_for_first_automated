const mongoose = require("mongoose");

const garmentSchema = new mongoose.Schema({
  name: String,
  price: Number,
  amt: Number,
  subTotal: Number,
});

const orderArchiveSchema = new mongoose.Schema({
  orderNo: { type: String },
  customer: { type: String },
  phone: { type: String },
  comment: { type: String },
  garments: { type: [garmentSchema] },
  dropOff: { type: String },
  due: { type: String },
  totalDue: { type: Number },
  pickupPoint: { type: String },

  // createdAt: { type: Date, default: Date.now }, // Sets current date as default
});

const archiveSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: orderArchiveSchema, required: true },
});

module.exports = mongoose.model("Archive", archiveSchema);
