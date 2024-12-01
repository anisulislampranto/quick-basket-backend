const express = require("express");
const {
  getChatsForShop,
  getOrCreateChat,
  addMessage,
} = require("../controllers/chatController");

const router = express.Router();

router.get("/shop/:shopId", getChatsForShop);
router.post("/chat", getOrCreateChat);
router.post("/message", addMessage);

module.exports = router;
