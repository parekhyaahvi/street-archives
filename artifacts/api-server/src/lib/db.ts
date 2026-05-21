import mongoose from "mongoose";
import { logger } from "./logger";

export const connectDB = async () => {
  const uri = process.env["MONGODB_URI"];
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is required");
  }
  try {
    const conn = await mongoose.connect(uri);
    logger.info({ host: conn.connection.host }, "MongoDB connected");
  } catch (error) {
    logger.error({ error }, "MongoDB connection error");
    process.exit(1);
  }
};
