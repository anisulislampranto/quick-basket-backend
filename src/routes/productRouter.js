const express = require("express");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const upload = require("../../config/multerconfig");
const { createProduct } = require("../controllers/productController");

const router = express.Router();

router.post("/create", isLoggedIn, upload.array("images", 5), createProduct);

module.exports = router;
