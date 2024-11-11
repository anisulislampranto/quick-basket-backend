const express = require("express");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const { createOrder, getOrders } = require("../controllers/orderController");

const router = express.Router();

router.post("/create", isLoggedIn, createOrder);
router.get("/", isLoggedIn, getOrders);

module.exports = router;
