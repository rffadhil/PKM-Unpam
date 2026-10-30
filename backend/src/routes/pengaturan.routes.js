import express from "express";

import {
  getAllPengaturan,
  getPengaturanByKey,
  updatePengaturan,
} from "../controllers/pengaturan.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { validatePengaturan } from "../validators/pengaturan.validator.js";

const router = express.Router();

// GET semua pengaturan sekolah
router.get("/", getAllPengaturan);

// GET pengaturan berdasarkan key
router.get("/:key", getPengaturanByKey);

// PUT memperbarui pengaturan sekolah
router.put(
  "/",
  requireAuth,
  validatePengaturan,
  updatePengaturan
);

export default router;