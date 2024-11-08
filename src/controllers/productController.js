const Product = require("../models/product");
const Shop = require("../models/shop");

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

    console.log("savedProduct", savedProduct);

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
