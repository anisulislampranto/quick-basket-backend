const Product = require("../models/product");
const Shop = require("../models/shop");
const moment = require("moment");

exports.getProducts = async (req, res, next) => {
  try {
    const { name, minPrice, maxPrice } = req.query;

    const filter = { isActive: true };
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (minPrice) {
      filter.price = { ...filter.price, $gte: Number(minPrice) };
    }
    if (maxPrice) {
      filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }

    const products = await Product.find(filter)
      .populate("shop")
      .populate("reviews.user");

    res.status(200).json({ message: "Success!", products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, isActive: true })
      .populate("shop")
      .populate("reviews.user");

    console.log("product", product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Success!", product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

exports.getTrendingProducts = async (req, res, next) => {
  try {
    const trendingProducts = await Product.find({ isTrending: true });

    res.status(200).json(trendingProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trending products" });
  }
};

exports.getNewArrivalProducts = async (req, res, next) => {
  try {
    const sevenDaysAgo = moment().subtract(7, "days").toDate();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newArrivals = await Product.find({
      createdAt: { $gte: sevenDaysAgo },
    });
    res.status(200).json(newArrivals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching new arrivals" });
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, shop } = req.body;

    if (!name || !price || !stock || !category || !shop) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const images = req.files ? req.files.map((file) => file.path) : [];

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      images,
      shop,
    });

    const savedProduct = await product.save();

    await Shop.findByIdAndUpdate(
      shop,
      { $push: { products: savedProduct._id } },
      { new: true }
    );

    return res
      .status(201)
      .json({ message: "Product created successfully", product: savedProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

exports.editProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { name, description, price, stock, category } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    if (req.files && req.files.length > 0) {
      product.images = req.files.map((file) => file.path);
    }

    const updatedProduct = await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

exports.createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;
    const userId = req.user._id;

    console.log("productid", productId);

    const product = await Product.findById(productId);
    console.log("product", product);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const newReview = { user: userId, rating, comment };
    product.reviews.push(newReview);
    await product.save();

    res.status(201).json({ message: "Review added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
