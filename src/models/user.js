const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  phoneNumber: String,
  role: { type: String, enum: ["customer", "seller"], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
