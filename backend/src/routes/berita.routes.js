
/** @format */

import { Router } from "express";

import {
  listPostsController,
  getPostController,
  listPublishedPostsController,
  getPublishedPostController,
  createPostController,
  updatePostController,
  deletePostController,
} from "../controllers/berita.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// ==========================================
// PUBLIK: Bisa diakses tanpa login
// ==========================================

router.get("/public", listPublishedPostsController);
router.get("/public/:slug", getPublishedPostController);

// ==========================================
// ADMIN: Wajib login
// ==========================================

router.get("/", requireAuth, listPostsController);
router.get("/:id", requireAuth, getPostController);

router.post("/", requireAuth, createPostController);
router.put("/:id", requireAuth, updatePostController);
router.delete("/:id", requireAuth, deletePostController);

export default router;
