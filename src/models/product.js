const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: {
    type: String,
    enum: [
      "electronics&Gadgets",
      "fashion&Apparel",
      "beauty&PersonalCare",
      "home&Living",
    ],
    required: true,
  },
  isTrending: { type: Boolean, default: false },
  images: {
    type: [String],
    validate: [
      {
        validator: arrayLimit,
        msg: "Exceeds the limit of 5 images",
      },
      {
        validator: (val) => val.length > 0,
        msg: "At least one image is required",
      },
    ],
    required: [true, "Images are required"],
  },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  sold: { type: Number, default: 0 },
  sales: [
    {
      quantity: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: { type: Number, min: 1, max: 5, required: true },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

function arrayLimit(val) {
  return val.length <= 5;
}

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
