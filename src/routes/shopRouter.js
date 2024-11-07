const express = require("express");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const { createShop } = require("../controllers/shopController");
const upload = require("../../config/multerconfig");

const router = express.Router();

router.post("/create", isLoggedIn, upload.single("image"), createShop);

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
// router.get(
//   "/github",
//   passport.authenticate("github", { scope: ["user:email"] })
// );

// router.get(
//   "/github/callback",
//   passport.authenticate("github", { session: false }),
//   async (req, res) => {
//     const token = createToken(req.user.email);
//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: req.user,
//     });
//   }
// );

module.exports = router;
