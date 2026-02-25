import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

connectDB();

const app = express();

/* ---------------- Security Middlewares ---------------- */
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

/* ---------------- CORS Configuration ---------------- */
const allowedOrigins = [
  "http://localhost:3000",
  "https://taskmanagement-ruddy-nine.vercel.app"
];

const corsOptionsDelegate = (req, callback) => {
  const origin = req.header("Origin");

  if (!origin) {
    // Allow Postman / curl
    return callback(null, { origin: true });
  }

  if (allowedOrigins.includes(origin)) {
    return callback(null, {
      origin: true,
      credentials: true
    });
  }

  return callback(null, { origin: false });
};

app.use(cors(corsOptionsDelegate));

/* ---------------- Rate Limiter ---------------- */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  })
);

/* ---------------- Routes ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

/* ---------------- 404 Handler ---------------- */
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

/* ---------------- Global Error Handler ---------------- */
app.use(errorHandler);

/* ---------------- Server Start ---------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
