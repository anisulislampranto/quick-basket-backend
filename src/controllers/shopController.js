const Shop = require("../models/shop");
const User = require("../models/user");

exports.createShop = async (req, res, next) => {
  const { name, description } = req.body;

  const logo = req.files["logo"] ? req.files["logo"][0].path : null;
  const coverImage = req.files["coverImage"]
    ? req.files["coverImage"][0].path
    : null;

  try {
    const user = await User.findById(req.user._id);

    if (!user || user.type !== "seller") {
      return res
        .status(403)
        .json({ message: "Only sellers can create shops." });
    }

    const existingShop = await Shop.findOne({ owner: user._id });
    if (existingShop) {
      return res.status(400).json({ message: "You already have a shop." });
    }

    // Validate required fields
    if (!name || !logo || !coverImage) {
      return res
        .status(400)
        .json({ message: "All fields (name, logo, coverImage) are required." });
    }

    const shopData = {
      name,
      description,
      logo,
      coverImage,
      owner: user._id,
    };

    const shop = new Shop(shopData);

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
