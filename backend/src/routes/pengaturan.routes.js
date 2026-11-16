/** @format */

import express from "express";

import {
  getAllPengaturan,
  getPengaturanByKey,
  updatePengaturan,
  listAdminController,
  createAdminController,
  updateAdminController,
  deleteAdminController,
  resetAdminPasswordController,
} from "../controllers/pengaturan.controller.js";

import {
  requireAuth,
  requireSuperAdmin,
} from "../middlewares/auth.middleware.js";
import { validatePengaturan } from "../validators/pengaturan.validator.js";

const router = express.Router();

// GET semua pengaturan sekolah (+ objek portal & daftar admin)
router.get("/", getAllPengaturan);

// PUT memperbarui pengaturan sekolah
router.put("/", requireAuth, validatePengaturan, updatePengaturan);

// Rute Manajemen Admin (Super Admin & Admin)
router.get("/admin/list", requireAuth, requireSuperAdmin, listAdminController);
router.post("/admin", requireAuth, requireSuperAdmin, createAdminController);
router.put("/admin/:id", requireAuth, requireSuperAdmin, updateAdminController);
router.delete("/admin/:id", requireAuth, requireSuperAdmin, deleteAdminController);
router.post(
  "/admin/:id/reset-password",
  requireAuth,
  requireSuperAdmin,
  resetAdminPasswordController,
);

// GET pengaturan berdasarkan key
router.get("/:key", getPengaturanByKey);

export default router;
