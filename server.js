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
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "https://taskmanagement-ruddy-nine.vercel.app"
];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (!req.header("Origin")) {
    corsOptions = { origin: true }; // allow requests without Origin (like curl/postman)
  } else if (allowedOrigins.includes(req.header("Origin"))) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false }; // block
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));
app.options("*", cors(corsOptionsDelegate));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
