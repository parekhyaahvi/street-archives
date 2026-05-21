const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Place a new order (clears cart)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { shippingAddress } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const orderItems = [];
    let subtotal = 0;

    // Verify inventory integrity and calculate dynamic totals from active database records
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} no longer exists.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Only ${product.stock} items left.`,
        });
      }

      const itemPrice = product.price;
      subtotal += itemPrice * item.quantity;

      orderItems.push({
        productId: item.productId,
        name: product.name,
        imageUrl: product.imageUrl,
        price: itemPrice,
        size: item.size,
        quantity: item.quantity,
      });
    }

    // Shipping calculation: Free shipping for orders $100+, otherwise flat $10 fee
    const shipping = subtotal >= 100 ? 0 : 10;
    const total = subtotal + shipping;

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentDetails: {
        method: "mock",
        status: "paid",
      },
      status: "Order Placed",
      subtotal,
      shipping,
      total,
      estimatedDelivery,
    });

    // Atomically decrement database product stocks
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Flush User's cart
    cart.items = [];
    await cart.save();

    return res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error.message);
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Get my orders error:", error.message);
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Get all orders error:", error.message);
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    const updatedOrder = await order.save();

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Update order status error:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
