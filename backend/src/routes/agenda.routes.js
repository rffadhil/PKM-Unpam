
/** @format */

import { Router } from "express";

import {
  listAgendaController,
  getAgendaController,
  createAgendaController,
  updateAgendaController,
  deleteAgendaController,
} from "../controllers/agenda.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// GET: Menampilkan semua agenda
// Bisa digunakan oleh publik dan admin
router.get("/", listAgendaController);

// GET: Menampilkan detail agenda
router.get("/:id", getAgendaController);

// POST: Membuat agenda baru (Admin)
router.post(
  "/",
  requireAuth,
  createAgendaController,
);

// PUT: Mengubah agenda (Admin)
router.put(
  "/:id",
  requireAuth,
  updateAgendaController,
);

// DELETE: Menghapus agenda (Admin)
router.delete(
  "/:id",
  requireAuth,
  deleteAgendaController,
);

export default router;
