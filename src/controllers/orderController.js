const Order = require("../models/order");
const Stripe = require("stripe");
const User = require("../models/user");
const Product = require("../models/product");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createOrder = async (req, res, next) => {
  const { items, totalPrice, deliveryAddress } = req.body;
  const customer = req.user?._id;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Items are required" });
  }
  if (!totalPrice || typeof totalPrice !== "number") {
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
      totalAmount: totalPrice,
      deliveryAddress,
    });

    // Save order to the database
    const savedOrder = await order.save();

    return res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.log("error", error);

    return res.status(500).json({ error });
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const orders =
      user.type === "admin"
        ? await Order.find().populate("items.product")
        : await Order.find({ customer: user._id }).populate("items.product");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
};

exports.payment = async (req, res, next) => {
  try {
    const { totalAmount, orderId, customerId } = req.body;

    // Check for missing required fields
    if (!totalAmount || !orderId || !customerId) {
      return res
        .status(400)
        .json({ error: "Required fields are missing in the request body." });
    }

    // Confirm that STRIPE_SECRET_KEY is set
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key is not defined.");
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Order Payment" },
            unit_amount: totalAmount * 100, // Convert amount to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    const transactionId = session.id;

    // Update the order with payment details
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        "payment.status": "paid",
        "payment.transactionId": transactionId,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json({ message: "Payment Success", data: session });
  } catch (error) {
    console.error("Error in payment:", error.message);
    res.status(500).json({
      error: "Failed to process payment",
      message: error.message,
    });
  }
};

exports.acceptOrder = async (req, res, next) => {
  const { orderId, itemId } = req.params;

  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, "items._id": itemId },
      { $set: { "items.$.orderStatus": "accepted" } },
      { new: true }
    );

    console.log("order", order);

    if (!order) {
      return res.status(404).json({ error: "Order item not found" });
    }

    res.json({ message: "Order item status updated successfully", order });
  } catch (error) {
    console.error("Error updating order item status:", error);
    res.status(500).json({ error: "Error updating order item status." });
  }
};

exports.acceptAllItems = async (req, res, next) => {
  try {
    const { orderId, shopId } = req.params;

    const updatedOrder = await Order.updateOne(
      { _id: orderId },
      {
        $set: { "items.$[elem].orderStatus": "accepted" },
      },
      {
        arrayFilters: [{ "elem.shop": shopId }],
        new: true,
      }
    );

    if (updatedOrder.modifiedCount === 0) {
      return res.status(404).json({
        message: "No items found for the specified shop in this order.",
      });
    }

    res.json({
      message: "All items from your shop have been accepted successfully.",
    });
  } catch (error) {
    console.error("Error accepting all items:", error);
    res
      .status(500)
      .json({ message: "Failed to accept all items for this order.", error });
  }
};
exports.updateOrderStatus = async (req, res) => {
  const { orderId, newStatus } = req.body;

  try {
    const order = await Order.findById(orderId).populate("items.product");
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Update order status
    order.orderStatus = newStatus;

    // If the order status is "delivered", update the sales array in each product
    if (newStatus === "delivered") {
      for (const item of order.items) {
        const product = item.product;
        const quantity = item.quantity;

        // Update the product's sales array
        product.sales.push({
          quantity,
          date: new Date(),
        });

        // Save the updated product
        await product.save();
      }
    }

    // Save the updated order
    await order.save();

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};
