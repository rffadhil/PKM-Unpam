
/** @format */

import { Router } from "express";

import {
  listGaleriController,
  getGaleriController,
  createGaleriController,
  updateGaleriController,
  deleteGaleriController,
  tambahFotoGaleriController,
  hapusFotoGaleriController,
} from "../controllers/galeri.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// GET: Menampilkan seluruh album (Publik & Admin)
router.get("/", listGaleriController);

// GET: Detail album beserta foto (Publik & Admin)
router.get("/:id", getGaleriController);

// POST: Membuat album baru
router.post("/", requireAuth, createGaleriController);

// POST: Menambahkan banyak foto ke album
router.post("/:id/foto", requireAuth, tambahFotoGaleriController);

// DELETE: Menghapus satu foto dari album
router.delete(
  "/:id/foto/:fotoId",
  requireAuth,
  hapusFotoGaleriController
);

// PUT: Mengubah album
router.put("/:id", requireAuth, updateGaleriController);

// DELETE: Menghapus album
router.delete("/:id", requireAuth, deleteGaleriController);

export default router;
