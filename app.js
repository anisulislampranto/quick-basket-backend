require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const http = require("http");
const { Server } = require("socket.io");

const port = process.env.PORT || 4000;

require("./src/utils/passportSetup");
require("./src/utils/cronJobs");

const Chat = require("./src/models/chat");
const authRouter = require("./src/routes/authRouter");
const shopRouter = require("./src/routes/shopRouter");
const productRouter = require("./src/routes/productRouter");
const couponRouter = require("./src/routes/couponRouter");
const orderRouter = require("./src/routes/orderRouter");
const { payment } = require("./src/controllers/orderController");
const chatRouter = require("./src/routes/chatRouter");
const User = require("./src/models/user");

// Middlewaree
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
});

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/shop", shopRouter);
app.use("/api/products", productRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", payment);
app.use("/api/chat", chatRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a specific chat room
  socket.on("joinChat", ({ chatId }) => {
    socket.join(chatId);
    console.log(`User joined chat room: ${chatId}`);
  });

  // Handle sending messages (both customer and shop)
  socket.on("sendMessage", async ({ chatId, sender, message, senderType }) => {
    if (!chatId || !sender || !message || !senderType) {
      console.log("Missing required fields for sendMessage.");
      return;
    }

    try {
      // Save the message to the database
      const chat = await Chat.findById(chatId);

      if (!chat) return;

      const newMessage = { sender, message, senderType };

      console.log("newMessage", newMessage);

      chat.messages.push(newMessage);
      chat.updatedAt = new Date();

      await chat.save();
      // Broadcast the message to everyone in the chat room
      io.to(chatId).emit("newMessage", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// MongoDB connection
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
