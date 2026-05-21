const Product = require("../models/Product");

// @desc    Get all products (with pagination, filters, sort)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.size) {
      query.sizes = req.query.size;
    }

    if (req.query.color) {
      query.colors = req.query.color;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }

    let sortOptions = {};
    if (req.query.sort) {
      if (req.query.sort === "priceAsc") {
        sortOptions.price = 1;
      } else if (req.query.sort === "priceDesc") {
        sortOptions.price = -1;
      } else {
        sortOptions.createdAt = -1;
      }
    } else {
      sortOptions.createdAt = -1;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Get products error:", error.message);
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Get product by ID error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes, colors, stock, images } = req.body;

    const imgUrl = req.file ? req.file.path : req.body.imageUrl;
    if (!imgUrl) {
      return res.status(400).json({ message: "Please upload a product image or provide imageUrl" });
    }

    const parsedSizes = typeof sizes === "string" ? sizes.split(",").map(s => s.trim()) : sizes;
    const parsedColors = typeof colors === "string" ? colors.split(",").map(c => c.trim()) : colors;
    
    let parsedImages = [];
    if (images) {
      parsedImages = typeof images === "string" ? images.split(",").map(i => i.trim()) : images;
    } else {
      parsedImages = [imgUrl];
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      sizes: parsedSizes || ["S", "M", "L", "XL"],
      colors: parsedColors || [],
      imageUrl: imgUrl,
      images: parsedImages,
      stock: Number(stock) || 0,
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error.message);
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes, colors, stock, images } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = Number(price);
    if (category) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);

    if (sizes) {
      product.sizes = typeof sizes === "string" ? sizes.split(",").map(s => s.trim()) : sizes;
    }
    if (colors) {
      product.colors = typeof colors === "string" ? colors.split(",").map(c => c.trim()) : colors;
    }
    if (images) {
      product.images = typeof images === "string" ? images.split(",").map(i => i.trim()) : images;
    }

    if (req.file) {
      product.imageUrl = req.file.path;
      if (product.images && product.images.length > 0) {
        product.images[0] = req.file.path;
      } else {
        product.images = [req.file.path];
      }
    } else if (req.body.imageUrl) {
      product.imageUrl = req.body.imageUrl;
      if (product.images && product.images.length > 0) {
        product.images[0] = req.body.imageUrl;
      } else {
        product.images = [req.body.imageUrl];
      }
    }

    const updatedProduct = await product.save();
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    console.error("Delete product error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
