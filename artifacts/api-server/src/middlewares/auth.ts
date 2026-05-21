import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const secret = process.env["JWT_SECRET"] || "dev_secret_key";
      const decoded = jwt.verify(token, secret) as { userId: string };
      req.user = await User.findById(decoded.userId).select("-password");
      if (!req.user) {
        res.status(401).json({ message: "Not authorized, user not found" });
        return;
      }
      return next();
    } catch {
      res.status(401).json({ message: "Not authorized, token failed" });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role === "admin") return next();
  res.status(403).json({ message: "Not authorized as an admin" });
};
