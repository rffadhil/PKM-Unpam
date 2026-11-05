
/** @format */

import { Router } from "express";

import {
  listDokumenController,
  listDokumenAdminController,
  getDokumenController,
  createDokumenController,
  updateDokumenController,
  deleteDokumenController,
  downloadDokumenController,
} from "../controllers/dokumen.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { uploadDokumen } from "../utils/upload.js";

const router = Router();

// Middleware untuk memastikan pengguna adalah admin
const requireAdmin = (req, res, next) => {
  const role = String(req.user?.role || "")
    .trim()
    .toLowerCase();

  const allowedRoles = ["admin", "super admin"];

  if (!allowedRoles.includes(role)) {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Khusus admin.",
    });
  }

  next();
};

// GET: Daftar dokumen publik
router.get("/", listDokumenController);

// GET: Daftar dokumen admin
router.get(
  "/admin",
  requireAuth,
  requireAdmin,
  listDokumenAdminController,
);

// GET: Download dokumen
router.get("/:id/download", downloadDokumenController);

// GET: Detail dokumen
router.get("/:id", getDokumenController);

// POST: Upload dokumen (Admin)
router.post(
  "/",
  requireAuth,
  requireAdmin,
  uploadDokumen.single("file"),
  createDokumenController,
);

// PUT: Edit informasi dokumen (Admin)
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  uploadDokumen.single("file"),
  updateDokumenController,
);

// DELETE: Hapus dokumen (Admin)
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  deleteDokumenController,
);

export default router;
