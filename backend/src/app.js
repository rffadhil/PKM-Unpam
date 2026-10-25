/** @format */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// 1. Middleware Keamanan & Log
app.use(helmet());
app.use(morgan("dev"));

// 2. Mengizinkan Frontend (http://localhost:5173) mengakses Backend ini
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Wajib true agar token login (cookie) bisa dikirim
  }),
);

// 3. Membaca data JSON, form, dan cookie dari request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Route tes untuk mengecek apakah server backend sudah jalan
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server Backend Portal SMA Harapan Jaya berjalan normal!",
  });
});

// 5. Penanganan jika URL API tidak ditemukan (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} tidak ditemukan`,
  });
});

// 6. Penanganan Error Global (500)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Terjadi kesalahan pada server internal",
  });
});

export default app;
