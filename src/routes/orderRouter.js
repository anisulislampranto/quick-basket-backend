const express = require("express");
const {
  createOrder,
  getOrders,
  acceptOrder,
  acceptAllItems,
  updateOrderStatus,
} = require("../controllers/orderController");
const { isLoggedIn } = require("../middleware/isLoggedIn");

const router = express.Router();

router.post("/create", isLoggedIn, createOrder);
router.put("/:orderId/item/:itemId/accept", isLoggedIn, acceptOrder);
router.put("/:orderId/accept-all-items/:shopId", isLoggedIn, acceptAllItems);
router.put("/update-status", isLoggedIn, updateOrderStatus);
router.get("/", isLoggedIn, getOrders);

module.exports = router;
