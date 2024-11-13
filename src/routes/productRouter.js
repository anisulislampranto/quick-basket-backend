const express = require("express");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const upload = require("../../config/multerconfig");
const {
  createProduct,
  editProduct,
  getProducts,
  getProduct,
  getTrendingProducts,
  getNewArrivalProducts,
  createProductReview,
} = require("../controllers/productController");
const { isShopOwner } = require("../middleware/isShopOwner");
const { myShop } = require("../controllers/shopController");

const router = express.Router();

router.get("/trending", getTrendingProducts);
router.get("/new-arrivals", getNewArrivalProducts);

router.post("/:productId/review", isLoggedIn, createProductReview);

router.get("/", getProducts);
router.get("/:id", getProduct);
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
