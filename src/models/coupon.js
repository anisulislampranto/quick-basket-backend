const { default: mongoose } = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  discountValue: { type: Number, required: true },
  minimumOrderValue: Number,
  expirationDate: Date,
  // applicableProducts: [
  //   { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  // ],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
