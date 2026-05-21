import mongoose from "mongoose";

export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  imageUrl: string;
  images: string[];
  stock: number;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, enum: ["Women", "Men", "New Arrivals", "Accessories"] },
    sizes: { type: [String], default: ["S", "M", "L", "XL"] },
    colors: { type: [String], default: [] },
    imageUrl: { type: String, required: true },
    images: { type: [String], default: [] },
    stock: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
