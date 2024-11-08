const express = require("express");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const upload = require("../../config/multerconfig");
const {
  createProduct,
  editProduct,
} = require("../controllers/productController");
const { isShopOwner } = require("../middleware/isShopOwner");
const { myShop } = require("../controllers/shopController");

const router = express.Router();

router.post(
  "/create",
  isLoggedIn,
  isShopOwner,
  upload.array("images", 5),
  createProduct
);
router.patch(
  "/:productId/edit",
  isLoggedIn,
  isShopOwner,
  upload.array("images", 5),
  editProduct
);

router.post("/my-shop", isLoggedIn, isShopOwner, myShop);

module.exports = router;
