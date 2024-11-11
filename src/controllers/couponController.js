const Coupon = require("../models/coupon");

exports.createCoupon = async (req, res, next) => {
  const {
    code,
    discountType,
    discountValue,
    minimumOrderValue,
    expirationDate,
  } = req.body;

  try {
    // if (req.user.type === "admin") {
    const createdCoupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      minimumOrderValue,
      expirationDate,
    });
    console.log("created");

    res
      .status(201)
      .json({ status: "created Coupon successfully", data: createdCoupon });
    // }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({ status: "Coupons", data: coupons });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
