const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;
