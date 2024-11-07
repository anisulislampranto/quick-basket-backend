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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

function arrayLimit(val) {
  return val.length <= 5;
}

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
