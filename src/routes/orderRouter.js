const express = require("express");
const { createOrder, getOrders } = require("../controllers/orderController");
const { isLoggedIn } = require("../middleware/isLoggedIn");

const router = express.Router();

router.post("/create", isLoggedIn, createOrder);
router.get("/", isLoggedIn, getOrders);

module.exports = router;
