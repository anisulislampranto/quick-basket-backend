const express = require("express");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const { createCoupon, getCoupons } = require("../controllers/couponController");

const router = express.Router();

router.post("/create", isLoggedIn, createCoupon);
router.get("/", getCoupons);

module.exports = router;
