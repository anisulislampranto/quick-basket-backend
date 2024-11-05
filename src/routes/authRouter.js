const express = require("express");
const { login, signup, googleAuth } = require("../controllers/authController");

const router = express.Router();

router.get("/google", googleAuth);
// router.post("/signup", signup);
// router.post("/login", login);

module.exports = router;
