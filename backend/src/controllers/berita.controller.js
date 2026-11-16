
/** @format */

import { validateBeritaInput } from "../validators/berita.validator.js";

import {
  getAllPosts,
  getPostById,
  getPublishedPosts,
  getPublishedPostBySlug,
  createPost,
  updatePost,
  softDeletePost,
} from "../services/berita.service.js";

// ADMIN: Daftar semua berita
export const listPostsController = async (_req, res, next) => {
  try {
    const posts = await getAllPosts();
    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// ADMIN: Detail berita berdasarkan ID
export const getPostController = async (req, res, next) => {
  try {
    const post = await getPostById(req.params.id);
    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// PUBLIK: Daftar berita yang sudah terbit
export const listPublishedPostsController = async (_req, res, next) => {
  try {
    const posts = await getPublishedPosts();
    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// PUBLIK: Detail berita berdasarkan slug
export const getPublishedPostController = async (req, res, next) => {
  try {
    const post = await getPublishedPostBySlug(req.params.slug);
    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// ADMIN: Membuat berita
export const createPostController = async (req, res, next) => {
  try {
    const validated = validateBeritaInput(req.body);
    const created = await createPost(validated, req.user?.id);

    return res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

// ADMIN: Memperbarui berita
export const updatePostController = async (req, res, next) => {
  try {
    // Ambil data berita yang tersimpan sebelum diperbarui.
    const postLama = await getPostById(req.params.id);

    // Ambil tanggal lama dari data berita.
    const sumberTanggalLama =
      postLama.tanggalIso ??
      postLama.tanggal ??
      postLama.tanggal_berita ??
      postLama.tanggalPublikasi ??
      postLama.created_at ??
      "";

    const tanggalLama = String(sumberTanggalLama).slice(0, 10);

    // Validasi dengan mempertimbangkan tanggal lama.
    const validated = validateBeritaInput(req.body, {
      tanggalLama,
    });

    const updated = await updatePost(req.params.id, validated);

    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// ADMIN: Menghapus berita
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
