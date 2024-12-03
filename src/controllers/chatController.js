// controllers/chatController.js
const Chat = require("../models/chat");

// Fetch all chats for a shop owner
exports.getShopChats = async (req, res) => {
  try {
    const { shopId } = req.params;
    const chats = await Chat.find({ shop: shopId })
      .populate("customer", "name")
      .sort("-updatedAt");
    res.status(200).json({ chats });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

// Fetch messages for a specific chat
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId).populate(
      "messages.sender",
      "name"
    );
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.status(200).json({ messages: chat.messages });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { sender, message } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    chat.messages.push({ sender, message });
    chat.updatedAt = new Date();
    await chat.save();

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Create a new chat (if it doesn't already exist)
exports.createChat = async (req, res) => {
  try {
    const { shopId, customerId } = req.body;

    let chat = await Chat.findOne({ shop: shopId, customer: customerId });
    if (!chat) {
      chat = new Chat({ shop: shopId, customer: customerId, messages: [] });
      await chat.save();
    }

    res.status(200).json({ chat });
  } catch (error) {
    res.status(500).json({ error: "Failed to create chat" });
  }
};
