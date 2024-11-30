require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app); // Create raw HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const port = process.env.PORT || 4000;

require("./src/utils/passportSetup");
require("./src/utils/cronJobs");

const authRouter = require("./src/routes/authRouter");
const shopRouter = require("./src/routes/shopRouter");
const productRouter = require("./src/routes/productRouter");
const couponRouter = require("./src/routes/couponRouter");
const orderRouter = require("./src/routes/orderRouter");
const { payment } = require("./src/controllers/orderController");

// Middleware
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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Socket.IO Setup
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join chat room
  socket.on("joinRoom", ({ chatId }) => {
    socket.join(chatId);
    console.log(`User joined room: ${chatId}`);
  });

  // Handle message sending
  socket.on("sendMessage", async ({ chatId, sender, message }) => {
    console.log(`Message received in room ${chatId}:`, message);

    // Save the message to MongoDB (requires Chat schema)
    const Chat = require("./src/models/Chat");
    const chat = await Chat.findById(chatId);
    if (chat) {
      chat.messages.push({ sender, message });
      await chat.save();

      // Broadcast the message to the room
      io.to(chatId).emit("newMessage", { sender, message });
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
