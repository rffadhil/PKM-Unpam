/** @format */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

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
import ekstrakurikulerRoutes from "./routes/ekstrakurikuler.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Middleware keamanan dan logging
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "blob:", "https:"],
      },
    },
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

// 4. Menyajikan file upload secara publik & fallback gambar aman
const uploadsBackend = path.join(__dirname, "../uploads");
const uploadsRoot = path.resolve(__dirname, "../../uploads");

const placeholderSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#f8fafc"/>
    <rect x="1" y="1" width="598" height="398" fill="none" stroke="#e2e8f0" stroke-width="2"/>
    <g fill="#94a3b8" transform="translate(260, 140)">
      <circle cx="40" cy="40" r="40" fill="#e2e8f0"/>
      <path d="M25 50 L35 38 L45 50 L55 34 L65 50 Z" fill="#94a3b8"/>
      <circle cx="33" cy="30" r="5" fill="#94a3b8"/>
    </g>
    <text x="300" y="250" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#64748b" text-anchor="middle">Pratinjau Gambar Tidak Tersedia</text>
  </svg>`,
  "utf-8",
);

app.use("/uploads", express.static(uploadsBackend));
app.use("/uploads", express.static(uploadsRoot));

// Fallback untuk file upload gambar yang tidak ada di disk (mencegah 404 pada tag <img>)
app.use("/uploads", (req, res, next) => {
  if (/\.(jpe?g|png|webp|gif|svg)$/i.test(req.path)) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).send(placeholderSvg);
  }
  next();
});

// Penanganan gambar yang di-request langsung tanpa prefix /uploads/ (misal: /1795345299470-709424038.jpg)
app.get(/^\/(\d{10,}-[\w-]+\.(jpe?g|png|webp|gif|svg))$/i, (req, res) => {
  const fileName = req.params[0];
  const file1 = path.join(uploadsBackend, fileName);
  const file2 = path.join(uploadsRoot, fileName);

  if (fs.existsSync(file1)) return res.sendFile(file1);
  if (fs.existsSync(file2)) return res.sendFile(file2);

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  return res.status(200).send(placeholderSvg);
});

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
app.use("/api/ekstrakurikuler", ekstrakurikulerRoutes);

// 7. Route Log Aktivitas Admin
app.use("/api/admin/aktivitas", aktivitasRoutes);

// 7b. Menyajikan hasil build frontend (SPA)
const backendPublicPath = path.resolve(__dirname, "../public");
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");
const distPath = fs.existsSync(path.join(backendPublicPath, "index.html"))
  ? backendPublicPath
  : frontendDistPath;

app.use(express.static(distPath));

app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

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
    ...(err.errors ? { errors: err.errors } : {}),
  });
});

export default app;
