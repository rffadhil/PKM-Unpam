/** @format */

import { Router } from "express";
import {
  loginController,
  logoutController,
  meController,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// POST /api/auth/login -> Masuk ke CMS
router.post("/login", loginController);

// POST /api/auth/logout -> Keluar dari CMS
router.post("/logout", logoutController);

// GET /api/auth/me -> Cek sesi admin yang sedang aktif
router.get("/me", requireAuth, meController);

export default router;
