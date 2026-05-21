const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Get cart error:", error.message);
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  const { productId, size, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const qty = Number(quantity) || 1;
    if (product.stock < qty) {
      return res.status(400).json({ message: `Insufficient stock. Only ${product.stock} items available.` });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (itemIndex > -1) {
      // Check that combined quantity doesn't exceed stock
      const newQty = cart.items[itemIndex].quantity + qty;
      if (product.stock < newQty) {
        return res.status(400).json({ message: `Cannot add more. Stock limit of ${product.stock} reached.` });
      }
      cart.items[itemIndex].quantity = newQty;
    } else {
      // Crucial: fetch price/metadata from product DB to block price injection
      cart.items.push({
        productId,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        size,
        quantity: qty,
      });
    }

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Add to cart error:", error.message);
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
  const { productId, size, quantity } = req.body;

  try {
    const qty = Number(quantity);
    if (!qty || qty < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < qty) {
      return res.status(400).json({ message: `Insufficient stock. Only ${product.stock} items available.` });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = qty;
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Update cart item error:", error.message);
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const { size } = req.query;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => !(item.productId.toString() === productId && item.size === size)
    );

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Remove from cart error:", error.message);
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Clear cart error:", error.message);
    return res.status(500).json({ message: "Server error, please try again" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
