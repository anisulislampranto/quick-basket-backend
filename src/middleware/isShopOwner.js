const User = require("../models/user");

exports.isShopOwner = async (req, res, next) => {
  try {
    const userWithShop = await User.findById(req.user._id).populate("shop");

    if (!userWithShop?.shop) {
      return res.status(404).json({ message: "No shop found for this user." });
    }

    if (
      userWithShop.shop &&
      userWithShop.shop.owner.toString() === req.user._id.toString()
    ) {
      return next();
    }

    res
      .status(403)
      .json({ message: "You do not have admin access to this shop." });
  } catch (error) {
    console.log("Error in isShopOwner:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
