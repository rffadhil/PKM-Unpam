
/** @format */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import stafRoutes from "./routes/staf.routes.js";
import beritaRoutes from "./routes/berita.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import pesanRoutes from "./routes/pesan.routes.js";
import pengaturanRoutes from "./routes/pengaturan.routes.js";
import agendaRoutes from "./routes/agenda.routes.js";
import dokumenRoutes from "./routes/dokumen.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import galeriRoutes from "./routes/galeri.routes.js";
import aktivitasRoutes from "./routes/aktivitas.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Middleware keamanan dan logging
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(morgan("dev"));

// 2. Mengizinkan frontend mengakses backend
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  }),
);

// 3. Membaca data JSON, form, dan cookie
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// 4. Menyajikan file upload secara publik
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 5. Route tes kesehatan server
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server Backend Portal SMA Harapan Jaya berjalan normal!",
  });
});

// 6. Daftar route API utama
app.use("/api/auth", authRoutes);
app.use("/api/staf", stafRoutes);
app.use("/api/posts", beritaRoutes);
app.use("/api/upload", uploadRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);

app.use("/api/pesan", pesanRoutes);
app.use("/api/pengaturan", pengaturanRoutes);
app.use("/api/agenda", agendaRoutes);
app.use("/api/dokumen", dokumenRoutes);
app.use("/api/galeri", galeriRoutes);

// 7. Route Log Aktivitas Admin
app.use("/api/admin/aktivitas", aktivitasRoutes);

// 8. Penanganan URL API tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} tidak ditemukan`,
  });
});

// 9. Penanganan error global
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Terjadi kesalahan pada server internal",
    ...(err.field ? { field: err.field } : {}),
  });
});

export default app;
