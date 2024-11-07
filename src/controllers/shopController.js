const Shop = require("../models/shop");
const User = require("../models/user");

exports.createShop = async (req, res, next) => {
  const { name, description } = req.body;

  const logo = req.files["logo"] ? req.files["logo"][0] : null;
  const coverImage = req.files["coverImage"]
    ? req.files["coverImage"][0]
    : null;

  console.log("logo", logo);
  console.log("coverImage", coverImage);

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
      logo: logo.path,
      coverImage: coverImage.path,
    });

    console.log("shop", shop);

    const savedShop = await shop.save();

    console.log("savedShop", savedShop);

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
