const express = require("express");
// access file
const fs = require("fs");
const path = require("path");

// import product model
const Product = require("../models/Product");
// use middleware
const authMiddleware = require("../middleware/authMiddleware.js");
const upload = require("../middleware/uploadMiddleware.js");

// activate router
const router = express.Router();

const deleteImage = (imagePath) => {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, "..", imagePath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

// need login to access
router.use(authMiddleware);

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 }); // sort with descending order

    return res.json({
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// create product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { productName, price, category, stock } = req.body;

    if (!productName || !price || !category || stock === undefined || stock === null) {
      return res.status(400).json({
        message: 'Name, Price, Category and Stock are required'
      });
    }

    // image checker
    const imagePath = req.file ? `uploads/products/${req.file.filename}` : null;

    const product = await Product.create({
      productName,
      price,
      category,
      stock,
      image: imagePath,
      user: req.user._id
    });

    return res.status(201).json({
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// Get detail product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('user', 'category');

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });

      return res.json({
        data: product
      });
    }
  } catch (error) {
      return res.status(500).json({
        message: "Server error",
        error: error.message
      });
  }
});

// Update product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { productName, price, category, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    let imagePath = product.image;

    if (req.file) {
      deleteImage(product.image);
      imagePath = `uploads/products/${req.file.filename}`;
    }

    product.productName = productName || product.productName;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.image = imagePath;

    await product.save();

    return res.json({
      message: 'Product update successfully',
      data: product
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    deleteImage(product.image);

    await product.deleteOne();

    return res.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.status
    });
  }
});

module.exports = router;