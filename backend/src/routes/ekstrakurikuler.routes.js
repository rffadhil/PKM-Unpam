/** @format */

import { Router } from "express";

import {
  listEkstrakurikulerController,
  getEkstrakurikulerController,
  createEkstrakurikulerController,
  updateEkstrakurikulerController,
  deleteEkstrakurikulerController,
} from "../controllers/ekstrakurikuler.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Menampilkan semua ekstrakurikuler
router.get("/", listEkstrakurikulerController);

// Menampilkan detail ekstrakurikuler
router.get("/:id", getEkstrakurikulerController);

// Menambahkan ekstrakurikuler
router.post("/", requireAuth, createEkstrakurikulerController);

// Mengubah ekstrakurikuler
router.put("/:id", requireAuth, updateEkstrakurikulerController);

// Menghapus ekstrakurikuler
router.delete("/:id", requireAuth, deleteEkstrakurikulerController);

export default router;