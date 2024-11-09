const Product = require("../models/product");
const Shop = require("../models/shop");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true }).populate("shop");
    res.status(200).json({ message: "Success!", products });
  } catch (error) {
    console.error("Error creating product:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, isActive: true }).populate(
      "shop"
    );

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
