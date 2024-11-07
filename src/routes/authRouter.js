const express = require("express");
const passport = require("passport");
const { googleAuth, getMe } = require("../controllers/authController");
const { isLoggedIn } = require("../middleware/isLoggedIn");

const router = express.Router();

router.get("/google", googleAuth);
// router.get(
//   "/facebook",
//   passport.authenticate("facebook", { scope: ["email"] })
// );
// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/login" }),
//   (req, res) => {
//     res.redirect("/"); // Redirect or send token after successful login
//   }
// );

// GitHub login
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  async (req, res) => {
    const token = createToken(req.user.email);
    res.status(200).json({
      message: "Login successful",
      token,
      user: req.user,
    });
  }
);

router.get("/getMe", isLoggedIn, getMe);

module.exports = router;
