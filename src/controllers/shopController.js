const Shop = require("../models/shop");
const User = require("../models/user");

exports.createShop = async (req, res, next) => {
  const { name, description } = req.body;
  const { path } = req?.file;

  try {
    const user = await User.findById({ _id: req.user._id });

    if (!user || user.type !== "seller") {
      return res
        .status(403)
        .json({ message: "Only sellers can create shops." });
    }

    const existingShop = await Shop.findOne({ owner: user._id });

    if (existingShop) {
      return res.status(400).json({ message: "You already have a shop." });
    }

    const shop = new Shop({
      name,
      description,
      owner: user._id,
      image: path,
    });

    console.log("shop", shop);

    const savedShop = await shop.save();

    user.shop = savedShop._id;
    await user.save();

    res.status(201).json({
      message: "Shop created successfully.",
      shop: savedShop,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
