const Order = require("../models/order");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createOrder = async (req, res, next) => {
  const { items, totalPrice, deliveryAddress } = req.body;
  const customer = req.user?._id;

  console.log("req.body", req.body);

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

    console.log("savedOrder", savedOrder);

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

exports.payment = async (req, res, next) => {
  console.log("req.user", req.body);

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

    console.log("session", session);

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

    console.log("updatedOrder", updatedOrder);

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
