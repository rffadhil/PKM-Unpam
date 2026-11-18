/** @format */

import { Router } from "express";
import {
  loginController,
  logoutController,
  meController,
  changePasswordController,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// POST /api/auth/login -> Masuk ke CMS
router.post("/login", loginController);

// POST /api/auth/logout -> Keluar dari CMS
router.post("/logout", logoutController);

// GET /api/auth/me -> Cek sesi admin yang sedang aktif
router.get("/me", requireAuth, meController);

// POST /api/auth/change-password -> Wajib mengganti sandi sementara
router.post("/change-password", requireAuth, changePasswordController);

export default router;
