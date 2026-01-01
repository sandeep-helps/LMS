import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // make sure env vars are loaded

const connectDb = async () => {
  try {
    const uri = `${process.env.MONGODB_URL}/${process.env.PROJECT_NAME}`;
    console.log("Connecting to MongoDB:"); // optional, for debugging

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ DB connected successfully");
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
  }
};

export default connectDb;
