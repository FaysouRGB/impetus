import mongoose from "mongoose";
import { MONGO_URI } from "./config.js";

export default async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
