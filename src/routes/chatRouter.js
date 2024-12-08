// routes/chatRouter.js
const express = require("express");
const {
  getShopChats,
  getChatMessages,
  createChat,
  helio,
} = require("../controllers/chatController");

const router = express.Router();

router.get("/shop/:shopId", getShopChats); // Fetch all chats for a shop
router.get("/:chatId", getChatMessages); // Fetch messages for a chat
router.post("/create", createChat); // Fetch messages for a chat
// router.post("/:chatId/message", sendMessage); // Send a message to a chat

module.exports = router;
