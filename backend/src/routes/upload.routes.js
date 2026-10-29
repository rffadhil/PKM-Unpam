/** @format */

import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { requireAuth } from "../middlewares/auth.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pastikan folder backend/uploads tersedia
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5 MB sesuai PRD
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg|gif|pdf|doc|docx|xls|xlsx/;
    const extValid = allowed.test(
      path.extname(file.originalname).toLowerCase(),
    );
    if (extValid) {
      return cb(null, true);
    }
    cb(new Error("Format file tidak didukung."));
  },
});

const router = Router();

// POST /api/upload
router.post("/", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Tidak ada file yang diunggah.",
    });
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

  return res.status(200).json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
  });
});

export default router;
