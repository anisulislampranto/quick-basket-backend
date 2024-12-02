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

const authRouter = require("./src/routes/authRouter");
const shopRouter = require("./src/routes/shopRouter");
const productRouter = require("./src/routes/productRouter");
const couponRouter = require("./src/routes/couponRouter");
const orderRouter = require("./src/routes/orderRouter");
const { payment } = require("./src/controllers/orderController");
const chatRouter = require("./src/routes/chatRouter");

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

  socket.on("joinRoom", ({ chatId }) => {
    socket.join(chatId);
    console.log(`User joined room: ${chatId}`);
  });

  socket.on("sendMessage", ({ chatId, sender, message }) => {
    console.log("chatId, sender, message", chatId, sender, message);
    io.to(chatId).emit("newMessage", { chatId, sender, message });
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
