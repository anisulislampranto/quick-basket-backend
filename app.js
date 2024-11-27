require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");

const port = process.env.PORT || 4000;

require("./src/utils/passportSetup");
require("./src/utils/cronJobs");

const authRouter = require("./src/routes/authRouter");
const shopRouter = require("./src/routes/shopRouter");
const productRouter = require("./src/routes/productRouter");
const couponRouter = require("./src/routes/couponRouter");
const orderRouter = require("./src/routes/orderRouter");
const { payment } = require("./src/controllers/orderController");

// Middlewaree
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
