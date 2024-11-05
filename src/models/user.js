const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  image: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  dateOfBirth: { type: String },
  phoneNumber: { type: String },
  type: {
    type: String,
    enum: ["customer", "seller", "admin"],
    // required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
