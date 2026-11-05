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
} from "../controllers/pengaturan.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { validatePengaturan } from "../validators/pengaturan.validator.js";

const router = express.Router();

// GET semua pengaturan sekolah (+ objek portal & daftar admin)
router.get("/", getAllPengaturan);

// PUT memperbarui pengaturan sekolah
router.put("/", requireAuth, validatePengaturan, updatePengaturan);

// Rute Manajemen Admin (Super Admin & Admin)
router.get("/admin/list", requireAuth, listAdminController);
router.post("/admin", requireAuth, createAdminController);
router.put("/admin/:id", requireAuth, updateAdminController);
router.delete("/admin/:id", requireAuth, deleteAdminController);

// GET pengaturan berdasarkan key
router.get("/:key", getPengaturanByKey);

export default router;
