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

/* =========================
   DATABASE CONNECTION
========================= */
connectDb();

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "https://edu-flex0-git-main-avnishs-projects-700a73fb.vercel.app",
      "https://eduflex0.vercel.app" // optional future domain
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔴 REQUIRED FOR CORS PREFLIGHT (VERY IMPORTANT)
app.options("*", cors());

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/ai", aiRouter);
app.use("/api/review", reviewRouter);

/* =========================
   ROOT TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("EduFlex0 Backend is running 🚀");
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
