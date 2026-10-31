/** @format */

import { Router } from "express";
import { getDashboardController } from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// GET /api/admin/dashboard atau /api/dashboard
router.get("/", requireAuth, getDashboardController);

export default router;
