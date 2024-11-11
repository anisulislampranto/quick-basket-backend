const Order = require("../models/order");

exports.createOrder = async (req, res, next) => {
  const { customer, items, totalAmount, deliveryAddress } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Items are required" });
  }
  if (!totalAmount || typeof totalAmount !== "number") {
    return res
      .status(400)
      .json({ error: "Total amount is required and must be a number" });
  }

  if (!deliveryAddress) {
    return res.status(400).json({ error: "Delivery address is required" });
  }

  try {
    // Create new order
    const order = new Order({
      customer,
      items,
      totalAmount,
      paymentMethod,
      deliveryAddress,
    });

    // Save order to the database
    const savedOrder = await order.save();

    console.log("savedOrder", savedOrder);

    return res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create order" });
  }
};

// Controller to get orders by user
exports.getOrders = async (req, res, next) => {
  console.log("reacher");

  try {
    const userOrders = await Order.find({ customer: req.user._id }).populate(
      "items.product"
    );

    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({ error: "No orders found for this user" });
    }

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders: userOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
};
