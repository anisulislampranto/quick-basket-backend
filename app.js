require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const mongoose = require("mongoose");

const port = process.env.PORT || 4000;

const authRouter = require("./src/routes/authRouter");

// middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// routes
app.use("/api/auth", authRouter);

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//
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
