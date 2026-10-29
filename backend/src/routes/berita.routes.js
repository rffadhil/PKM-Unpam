/** @format */

import { Router } from "express";
import {
  listPostsController,
  getPostController,
  createPostController,
  updatePostController,
  deletePostController,
} from "../controllers/berita.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Publik & Admin bisa melihat daftar dan detail berita
router.get("/", listPostsController);
router.get("/:id", getPostController);

// Hanya Admin yang login yang bisa menambah, mengubah, dan menghapus berita
router.post("/", requireAuth, createPostController);
router.put("/:id", requireAuth, updatePostController);
router.delete("/:id", requireAuth, deletePostController);

export default router;
