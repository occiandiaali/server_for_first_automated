const mongoose = require("mongoose");

const garmentSchema = new mongoose.Schema({
  //{name: 'Shirt(long)', price: 400, amt: 5, subTotal: 2000}
  name: String,
  price: Number,
  amt: Number,
  subTotal: Number,
});

const orderSchema = new mongoose.Schema({
  orderNo: { type: String, required: true },
  customer: { type: String, required: true },
  phone: { type: String, required: true },
  comment: { type: String, default: "No comment" },
  garments: { type: [garmentSchema], required: true },
  dropOff: { type: String, required: true },
  due: { type: String, required: true },
  totalDue: { type: Number, required: true },
  pickupPoint: { type: String, required: true },

  // createdAt: { type: Date, default: Date.now }, // Sets current date as default
});

module.exports = mongoose.model("Order", orderSchema);
