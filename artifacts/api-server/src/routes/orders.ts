import { Router } from "express";
import { protect, admin, type AuthRequest } from "../middlewares/auth";
import { Order } from "../models/Order";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";

const router = Router();

router.use(protect as any);

router.post("/", async (req: AuthRequest, res) => {
  const { shippingAddress } = req.body;
  if (!shippingAddress?.firstName || !shippingAddress?.lastName || !shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.zip) {
    res.status(400).json({ message: "All shipping address fields are required" });
    return;
  }
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: "Your cart is empty" });
      return;
    }
    const orderItems: any[] = [];
    let subtotal = 0;

    for (const item of cart.items as any[]) {
      const product = await Product.findById(item.productId);
      if (!product) {
        res.status(404).json({ message: `Product ${item.name} no longer exists.` });
        return;
      }
      if (product.stock < item.quantity) {
        res.status(400).json({ message: `Insufficient stock for ${product.name}. Only ${product.stock} items left.` });
        return;
      }
      subtotal += product.price * item.quantity;
      orderItems.push({ productId: item.productId, name: product.name, imageUrl: product.imageUrl, price: product.price, size: item.size, quantity: item.quantity });
    }

    const shipping = subtotal >= 100 ? 0 : 10;
    const total = subtotal + shipping;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentDetails: { method: "mock", status: "paid" },
      status: "Order Placed",
      subtotal, shipping, total, estimatedDelivery,
    });

    for (const item of cart.items as any[]) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }
    cart.items = [] as any;
    await cart.save();

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ message: "Server error, please try again" });
  }
});

router.get("/myorders", async (req: AuthRequest, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: "Server error, please try again" });
  }
});

router.get("/", admin as any, async (req: AuthRequest, res) => {
  try {
    const orders = await Order.find({}).populate("userId", "name email").sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: "Server error, please try again" });
  }
});

router.put("/:id/status", admin as any, async (req: AuthRequest, res) => {
  const { status } = req.body;
  const validStatuses = ["Order Placed", "Processing", "Shipped", "Delivered"];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ message: "Valid status is required" });
    return;
  }
  try {
    const order = await Order.findById(req.params.id);
    if (!order) { res.status(404).json({ message: "Order not found" }); return; }
    order.status = status;
    const updated = await order.save();
    res.status(200).json(updated);
  } catch (error: any) {
    if (error.kind === "ObjectId") { res.status(404).json({ message: "Order not found" }); return; }
    res.status(500).json({ message: "Server error, please try again" });
  }
});

export default router;
