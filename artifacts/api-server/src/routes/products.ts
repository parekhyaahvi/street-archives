import { Router } from "express";
import { protect, admin } from "../middlewares/auth";
import { Product } from "../models/Product";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const query: any = {};

    if (req.query.category) query.category = req.query.category;
    if (req.query.size) query.sizes = req.query.size;
    if (req.query.color) query.colors = req.query.color;
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }
    if (req.query.featured === "true") {
      query.featured = true;
    }

    let sortOptions: any = {};
    if (req.query.sort === "priceAsc") sortOptions.price = 1;
    else if (req.query.sort === "priceDesc") sortOptions.price = -1;
    else {
      sortOptions.featured = -1;
      sortOptions.createdAt = -1;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortOptions).skip(skip).limit(limit);

    res.status(200).json({ products, page, pages: Math.ceil(total / limit), total });
  } catch (error: any) {
    res.status(500).json({ message: "Server error, please try again" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error: any) {
    if (error.kind === "ObjectId") {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(500).json({ message: "Server error, please try again" });
  }
});

router.post("/", protect as any, admin as any, async (req, res) => {
  try {
    const { name, description, price, category, sizes, colors, stock, imageUrl, images } = req.body;
    if (!imageUrl) {
      res.status(400).json({ message: "Please provide imageUrl" });
      return;
    }
    const parsedSizes = typeof sizes === "string" ? sizes.split(",").map((s: string) => s.trim()) : sizes;
    const parsedColors = typeof colors === "string" ? colors.split(",").map((c: string) => c.trim()) : colors;
    const parsedImages = images
      ? typeof images === "string" ? images.split(",").map((i: string) => i.trim()) : images
      : [imageUrl];

    const product = await Product.create({
      name, description, price: Number(price), category,
      sizes: parsedSizes || ["S", "M", "L", "XL"],
      colors: parsedColors || [],
      imageUrl,
      images: parsedImages,
      stock: Number(stock) || 0,
    });
    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ message: "Server error, please try again" });
  }
});

router.put("/:id", protect as any, admin as any, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    const { name, description, price, category, sizes, colors, stock, imageUrl, images } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = Number(price);
    if (category) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);
    if (sizes) product.sizes = typeof sizes === "string" ? sizes.split(",").map((s: string) => s.trim()) : sizes;
    if (colors) product.colors = typeof colors === "string" ? colors.split(",").map((c: string) => c.trim()) : colors;
    if (images) product.images = typeof images === "string" ? images.split(",").map((i: string) => i.trim()) : images;
    if (imageUrl) {
      product.imageUrl = imageUrl;
      if (product.images?.length > 0) product.images[0] = imageUrl;
      else product.images = [imageUrl];
    }
    const updated = await product.save();
    res.status(200).json(updated);
  } catch (error: any) {
    if (error.kind === "ObjectId") { res.status(404).json({ message: "Product not found" }); return; }
    res.status(500).json({ message: "Server error, please try again" });
  }
});

router.delete("/:id", protect as any, admin as any, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) { res.status(404).json({ message: "Product not found" }); return; }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product removed successfully" });
  } catch (error: any) {
    if (error.kind === "ObjectId") { res.status(404).json({ message: "Product not found" }); return; }
    res.status(500).json({ message: "Server error, please try again" });
  }
});

export default router;
