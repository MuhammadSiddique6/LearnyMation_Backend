const Order = require("../models/order");

exports.Order = async (req, res) => {
    const email = req.user.email;
    const { productId, productName, mobile, address } = req.body;

  if (!productId || !productName || !mobile || !address) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newOrder = new Order({ productId, productName,email, mobile, address });
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};