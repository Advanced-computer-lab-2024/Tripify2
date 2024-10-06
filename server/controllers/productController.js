const Product = require("../models/Product");
const User = require("../models/User");
const SellerModel = require("../models/Seller");

async function getMyProducts(req, res) {
  const { userId } = req.params;
  try {
    const products = await Product.find({ Seller: userId }).populate("Seller");
    return res.json(products);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error fetching products", error: e.message });
  }
}

async function getProducts(req, res) {
  try {
    const { search, minPrice, maxPrice, minRating } = req.query;
    let query = {};

    if (search) query.name = "/" + search + "/i";

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (minRating) query.rating = { $gte: parseFloat(minRating) };

    const products = await Product.find(query).populate("Seller");
    return res.json(products);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error fetching products", error: e.message });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("Seller");
    return res.json(product);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error fetching product", error: e.message });
  }
}

async function createProduct(req, res) {
  try {
    const {
      Name,
      Image,
      Price,
      Description,
      Seller,
      Rating = 0,
      Reviews = [],
      AvailableQuantity,
    } = req.body;

    const seller = await User.findById(Seller, "_id");
    if (!seller || seller._id.toString() !== req._id)
      return res.status(400).json({ message: "Unauthorized Seller!" });

    const product = new Product({
      Name,
      Image,
      Price,
      Description,
      Seller,
      Rating,
      Reviews,
      AvailableQuantity,
    });

    await product.save();

    await SellerModel.findOneAndUpdate(
      { UserId: req._id },
      { $push: { Products: product._id } },
      { new: true }
    )
      .populate("Seller")
      .catch((err) => console.log(err));

    return res
      .status(201)
      .json({ message: "Product created successfully", product });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error creating product", error: e.message });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findById(id);

    if (
      !deletedProduct ||
      deletedProduct.Seller.toString() !== req._id.toString()
    )
      return res.status(400).json({ message: "Unauthorized Seller!" });

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(updatedProduct);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error updating product", error: e.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findById(id);

    if (
      !deletedProduct ||
      deletedProduct.Seller.toString() !== req._id.toString()
    )
      return res.status(400).json({ message: "Unauthorized Seller!" });

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ message: "Product deleted successfully" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Error deleting product", error: e.message });
  }
}

module.exports = {
  getProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
