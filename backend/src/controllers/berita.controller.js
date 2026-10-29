/** @format */

import { validateBeritaInput } from "../validators/berita.validator.js";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  softDeletePost,
} from "../services/berita.service.js";

export const listPostsController = async (_req, res, next) => {
  try {
    const posts = await getAllPosts();
    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostController = async (req, res, next) => {
  try {
    const post = await getPostById(req.params.id);
    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const createPostController = async (req, res, next) => {
  try {
    const validated = validateBeritaInput(req.body);
    const created = await createPost(validated, req.user?.id);
    return res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const updatePostController = async (req, res, next) => {
  try {
    const validated = validateBeritaInput(req.body);
    const updated = await updatePost(req.params.id, validated);
    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deletePostController = async (req, res, next) => {
  try {
    await softDeletePost(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Artikel berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
};
