// models/Chat.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderType", // Reference will depend on senderType
    },
    senderType: {
      type: String,
      enum: ["User", "Shop"], // Could be either a User or Shop
      // required: true,
    },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Customer ID
    messages: [messageSchema], // Array of messages
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
