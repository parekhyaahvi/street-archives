const express = require("express");
const { check, validationResult } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

// All cart routes require token verification
router.use(protect);

// @route   GET /api/cart
router.get("/", getCart);

// @route   POST /api/cart/add
router.post(
  "/add",
  [
    check("productId", "Valid Product ID is required").notEmpty().isMongoId(),
    check("size", "Size is required").notEmpty(),
    check("quantity", "Quantity must be a positive integer").optional().isInt({ min: 1 }),
  ],
  validateRequest,
  addToCart
);

// @route   PUT /api/cart/update
router.put(
  "/update",
  [
    check("productId", "Valid Product ID is required").notEmpty().isMongoId(),
    check("size", "Size is required").notEmpty(),
    check("quantity", "Quantity must be a positive integer").isInt({ min: 1 }),
  ],
  validateRequest,
  updateCartItem
);

// @route   DELETE /api/cart/remove/:productId
router.delete("/remove/:productId", removeFromCart);

// @route   DELETE /api/cart/clear
router.delete("/clear", clearCart);

module.exports = router;
