/** @format */

import express from "express";

import {
  kirimPesan,
  tampilkanPesan,
  detailPesan,
  ubahStatusPesan,
} from "../controllers/pesan.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Publik: pengunjung mengirim pesan
router.post("/", kirimPesan);

// Admin: melihat semua pesan
router.get("/", requireAuth, tampilkanPesan);

// Admin: melihat detail pesan
router.get("/:id", requireAuth, detailPesan);

// Admin: mengubah status pesan
router.patch("/:id/status", requireAuth, ubahStatusPesan);

export default router;