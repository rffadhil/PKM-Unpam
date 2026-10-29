
/** @format */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import stafRoutes from "./routes/staf.routes.js";

dotenv.config();

const app = express();

// 1. Middleware Keamanan & Log
app.use(helmet());
app.use(morgan("dev"));

// 2. Mengizinkan Frontend mengakses Backend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// 3. Membaca data JSON, form, dan cookie
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Route tes kesehatan server
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server Backend Portal SMA Harapan Jaya berjalan normal!",
  });
});

// 5. Daftar Route API Utama
app.use("/api/auth", authRoutes);
app.use("/api/staf", stafRoutes);

// 6. Penanganan URL API tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} tidak ditemukan`,
  });
});

// 7. Penanganan Error Global
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Terjadi kesalahan pada server internal",
  });
});

export default app;
