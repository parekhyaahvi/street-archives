import { Router } from "express";
import { protect, type AuthRequest } from "../middlewares/auth";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";

const router = Router();

router.use(protect as any);

router.get("/", async (req: AuthRequest, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(500).json({ message: "Server error, please try again" });
  }
});

router.post("/add", async (req: AuthRequest, res) => {
  const { productId, size, quantity } = req.body;
  if (!productId || !size) {
    res.status(400).json({ message: "productId and size are required" });
    return;
  }
  try {
    (req as any).log?.info({ productId, size, quantity, userId: req.user?._id }, "add to cart attempt");
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    const qty = Number(quantity) || 1;
    if (product.stock < qty) {
      res.status(400).json({ message: `Insufficient stock. Only ${product.stock} items available.` });
      return;
    }
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    const itemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId && item.size === size
    );
    if (itemIndex > -1) {
      const newQty = (cart.items[itemIndex] as any).quantity + qty;
      if (product.stock < newQty) {
        res.status(400).json({ message: `Cannot add more. Stock limit of ${product.stock} reached.` });
        return;
      }
      (cart.items[itemIndex] as any).quantity = newQty;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        size,
        quantity: qty,
      } as any);
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (error: any) {
    (req as any).log?.error({ err: error.message, stack: error.stack }, "add to cart error");
    res.status(500).json({ message: "Server error, please try again" });
  }
});

router.put("/update", async (req: AuthRequest, res) => {
  const { productId, size, quantity } = req.body;
  const qty = Number(quantity);
  if (!qty || qty < 1) {
    res.status(400).json({ message: "Quantity must be at least 1" });
    return;
  }
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    if (product.stock < qty) {
      res.status(400).json({ message: `Insufficient stock. Only ${product.stock} items available.` });
      return;
    }
    const itemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId && item.size === size
    );
    if (itemIndex > -1) {
      (cart.items[itemIndex] as any).quantity = qty;
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error: any) {
    res.status(500).json({ message: "Server error, please try again" });
  }
});

router.delete("/remove/:productId", async (req: AuthRequest, res) => {
  const { productId } = req.params;
  const { size } = req.query;
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }
    cart.items = cart.items.filter(
      (item: any) => !(item.productId.toString() === productId && item.size === size)
    ) as any;
    await cart.save();
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(500).json({ message: "Server error, please try again" });
  }
});

router.delete("/clear", async (req: AuthRequest, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }
    cart.items = [] as any;
    await cart.save();
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(500).json({ message: "Server error, please try again" });
  }
});

export default router;
