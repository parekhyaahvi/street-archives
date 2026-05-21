import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const router = Router();

const generateToken = (userId: string, role: string) => {
  const secret = process.env["JWT_SECRET"];
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return jwt.sign({ userId, role }, secret, { expiresIn: "7d" });
};

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ message: "Please provide name, email and password" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ message: "Password must be 6 or more characters" });
    return;
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const user = await User.create({ name, email, password });
    res.status(201).json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(String(user._id), user.role),
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Please provide email and password" });
    return;
  }
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken(String(user._id), user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error: any) {
    res.status(500).json({ message: "Server error, please try again" });
  }
});

export default router;
