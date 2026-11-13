/** @format */

import { Router } from "express";
import { getDashboardController, getAktivitasController } from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// GET /api/admin/dashboard atau /api/dashboard
router.get("/", requireAuth, getDashboardController);

// GET /api/admin/dashboard/aktivitas?page=1&limit=5
router.get("/aktivitas", requireAuth, getAktivitasController);

export default router;
