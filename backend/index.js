import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDb from "./configs/db.js";

import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import courseRouter from "./routes/courseRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import aiRouter from "./routes/aiRoute.js";
import reviewRouter from "./routes/reviewRoute.js";

dotenv.config();

const app = express();

// 🔥 Connect DB ON FUNCTION LOAD
connectDb();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "https://edu-flex0-git-main-avnishs-projects-700a73fb.vercel.app",
    ],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/ai", aiRouter);
app.use("/api/review", reviewRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Hello From Server");
});

export default app;
