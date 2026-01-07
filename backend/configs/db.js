import mongoose from "mongoose";

let isConnected = false;

const connectDb = async () => {
  if (isConnected) {
    return;
  }

  try {
    const uri = process.env.MONGODB_URL;

    if (!uri) {
      throw new Error("MONGODB_URL is missing");
    }

    const db = await mongoose.connect(uri, {
      dbName: process.env.PROJECT_NAME, // optional
    });

    isConnected = db.connections[0].readyState === 1;

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error; // 🔥 VERY IMPORTANT
  }
};

export default connectDb;
