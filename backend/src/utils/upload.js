
/** @format */

import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// Folder penyimpanan dokumen
const uploadDir = path.resolve(
  process.cwd(),
  "uploads",
  "dokumen",
);

// Membuat folder otomatis jika belum tersedia
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Jenis file yang diperbolehkan
const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const filename = `${crypto.randomUUID()}${extension}`;

    cb(null, filename);
  },
});

// Validasi file
const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    const error = new Error(
      "Format file harus PDF, DOCX, atau XLSX.",
    );

    error.status = 400;

    return cb(error, false);
  }

  cb(null, true);
};

// Konfigurasi Multer
export const uploadDokumen = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024, // Maksimal 10 MB
  },
});
