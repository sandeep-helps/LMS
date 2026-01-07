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

/* =========================
   CORS CONFIGURATION
========================= */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://edu-flex0.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server & tools like Postman
      if (!origin) return callback(null, true);

      // Allow listed origins & all Vercel preview URLs
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ REQUIRED for preflight requests
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
