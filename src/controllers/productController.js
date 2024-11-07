const Product = require("../models/product");

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

    await product.save();

    console.log("savedProduct", product);

    return res
      .status(201)
      .json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
