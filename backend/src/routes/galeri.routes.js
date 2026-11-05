/** @format */

import { Router } from "express";
import {
  listGaleriController,
  getGaleriController,
  createGaleriController,
  updateGaleriController,
  deleteGaleriController,
} from "../controllers/galeri.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// GET: Menampilkan daftar album (Bisa diakses Publik & Admin, mendukung filter kategori)
router.get("/", listGaleriController);

// GET: Detail album
router.get("/:id", getGaleriController);

// POST: Membuat album baru (Admin)
router.post("/", requireAuth, createGaleriController);

// PUT: Mengubah album (Admin)
router.put("/:id", requireAuth, updateGaleriController);

// DELETE: Menghapus album (Admin)
router.delete("/:id", requireAuth, deleteGaleriController);

export default router;

