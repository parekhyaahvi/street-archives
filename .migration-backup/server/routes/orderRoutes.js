const express = require("express");
const { check, validationResult } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

// All order routes require JWT authentication
router.use(protect);

// @route   POST /api/orders
// @desc    Place a new order
// @access  Private (User)
router.post(
  "/",
  [
    check("shippingAddress.firstName", "First name is required").notEmpty().trim(),
    check("shippingAddress.lastName", "Last name is required").notEmpty().trim(),
    check("shippingAddress.street", "Street address is required").notEmpty().trim(),
    check("shippingAddress.city", "City is required").notEmpty().trim(),
    check("shippingAddress.zip", "ZIP code is required").notEmpty().trim(),
  ],
  validateRequest,
  createOrder
);

// @route   GET /api/orders/myorders
// @desc    Get logged-in user's orders
// @access  Private (User)
router.get("/myorders", getMyOrders);

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get("/", admin, getAllOrders);

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put(
  "/:id/status",
  admin,
  [
    check("status", "Valid status is required").isIn([
      "Order Placed",
      "Processing",
      "Shipped",
      "Delivered",
    ]),
  ],
  validateRequest,
  updateOrderStatus
);

module.exports = router;
