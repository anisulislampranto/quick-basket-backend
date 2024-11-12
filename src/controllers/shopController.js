const Order = require("../models/order");
const Product = require("../models/product");
const Shop = require("../models/shop");
const User = require("../models/user");

exports.createShop = async (req, res, next) => {
  const { name, description } = req.body;

  console.log("req.files", req.files);

  // Get file paths if they exist
  const logo = req?.files["logo"] ? req?.files["logo"][0].path : undefined;
  const coverImage = req?.files["coverImage"]
    ? req?.files["coverImage"][0].path
    : undefined;

  try {
    const user = await User.findById({ _id: req.user._id });

    if (!user || user.type !== "seller") {
      return res
        .status(403)
        .json({ message: "Only sellers can create shops." });
    }

    // Check if user already has a shop
    const existingShop = await Shop.findOne({ owner: user._id });

    if (existingShop) {
      return res.status(400).json({ message: "You already have a shop." });
    }

    const shopData = {
      name,
      description,
      owner: user._id,
      ...(logo && { logo }),
      ...(coverImage && { coverImage }),
    };

    const shop = new Shop(shopData);
    console.log("shop", shop);

    const savedShop = await shop.save();

    user.shop = savedShop._id;
    await user.save();

    res.status(201).json({
      message: "Shop created successfully.",
      shop: savedShop,
    });
  } catch (error) {
    console.error("error", error);
    return res.status(400).json({ error: error.message });
  }
};

exports.myShop = async (req, res, next) => {
  try {
    const userWithShop = await User.findById(req.user._id).populate("shop");

    if (!userWithShop.shop) {
      return res.status(404).json({ message: "No shop found for this user." });
    }

    res.status(200).json({
      message: "Shop retrieved successfully",
      shop: userWithShop.shop,
    });
  } catch (error) {
    console.error("Error in myShop:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.getShopOrders = async (req, res, next) => {
  console.log("bari");

  try {
    const { shopId } = req.params;

    const products = await Product.find({ shop: shopId }).select("_id");

    const productIds = products.map((product) => product._id);

    console.log("productIds", productIds);

    const orders = await Order.find({ "items.product": { $in: productIds } })
      .populate("customer", "name email")
      .populate("items.product", "name price");

    console.log("orders", orders);

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching shop orders:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
