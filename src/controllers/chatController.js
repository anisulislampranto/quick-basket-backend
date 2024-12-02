const Chat = require("../models/Chat");

// Fetch active chats for the shop
const getChatsForShop = async (req, res) => {
  const { shopId } = req.params;

  try {
    const chats = await Chat.find({ shop: shopId }).populate(
      "customer",
      "name"
    );
    const formattedChats = chats.map((chat) => ({
      _id: chat._id,
      customerName: chat.customer.name,
      messages: chat.messages,
    }));

    res.status(200).json({ chats: formattedChats });
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats", error });
  }
};

// Create or fetch a chat
const getOrCreateChat = async (req, res) => {
  const { customerId, shopId } = req.body;

  try {
    let chat = await Chat.findOne({ customer: customerId, shop: shopId });

    if (!chat) {
      chat = await Chat.create({
        customer: customerId,
        shop: shopId,
        messages: [],
      });
    }

    res.status(200).json({ chat });
  } catch (error) {
    res.status(500).json({ message: "Error creating chat", error });
  }
};

// Add a message to a chat
const addMessage = async (req, res) => {
  const { chatId, sender, message } = req.body;

  console.log("req.body");

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    chat.messages.push({ sender, message });
    await chat.save();

    res.status(200).json({ chat });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};

module.exports = { getChatsForShop, getOrCreateChat, addMessage };
