const express = require("express");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const { createShop } = require("../controllers/shopController");
const upload = require("../../config/multerconfig");

const router = express.Router();

router.post(
  "/create",
  isLoggedIn,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  createShop
);

module.exports = router;
