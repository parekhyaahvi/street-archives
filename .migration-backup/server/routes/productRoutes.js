const express = require("express");
const { check, validationResult } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get("/", getProducts);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get("/:id", getProductById);

// @route   POST /api/products
// @desc    Create product
// @access  Private/Admin
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  [
    check("name", "Product name is required").notEmpty().trim(),
    check("description", "Product description is required").notEmpty(),
    check("price", "Price must be a positive number").isFloat({ min: 0 }),
    check("category", "Valid category is required").isIn(["Women", "Men", "New Arrivals", "Accessories"]),
    check("stock", "Stock must be a non-negative integer").isInt({ min: 0 }),
  ],
  validateRequest,
  createProduct
);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  [
    check("price", "Price must be a positive number").optional().isFloat({ min: 0 }),
    check("category", "Valid category is required").optional().isIn(["Women", "Men", "New Arrivals", "Accessories"]),
    check("stock", "Stock must be a non-negative integer").optional().isInt({ min: 0 }),
  ],
  validateRequest,
  updateProduct
);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
