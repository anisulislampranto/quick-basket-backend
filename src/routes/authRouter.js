const express = require("express");
const {
  login,
  signup,
  googleAuth,
  getMe,
} = require("../controllers/authController");
const { isLoggedIn } = require("../middleware/isLoggedIn");

const router = express.Router();

router.get("/google", googleAuth);
router.get("/getMe", isLoggedIn, getMe);
// router.post("/signup", signup);
// router.post("/login", login);

module.exports = router;
