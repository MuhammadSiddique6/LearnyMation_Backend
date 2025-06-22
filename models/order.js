// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
