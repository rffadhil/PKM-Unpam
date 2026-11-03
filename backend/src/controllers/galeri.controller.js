/** @format */

import {
  getAllGaleri,
  getGaleriById,
  createGaleri,
  updateGaleri,
  softDeleteGaleri,
} from "../services/galeri.service.js";
import { validateGaleriInput } from "../validators/galeri.validator.js";

// GET: Menampilkan seluruh album galeri (dengan filter kategori & pencarian)
export const listGaleriController = async (req, res, next) => {
  try {
    const list = await getAllGaleri(req.query);
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

// GET: Detail satu album
export const getGaleriController = async (req, res, next) => {
  try {
    const item = await getGaleriById(req.params.id);
    return res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

// POST: Membuat album baru (Admin)
export const createGaleriController = async (req, res, next) => {
  try {
    const validated = validateGaleriInput(req.body);
    const created = await createGaleri(validated, req.user?.id);
    return res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

// PUT: Mengubah album (Admin)
export const updateGaleriController = async (req, res, next) => {
  try {
    const validated = validateGaleriInput(req.body);
    const updated = await updateGaleri(req.params.id, validated);
    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE: Menghapus album (Admin)
export const deleteGaleriController = async (req, res, next) => {
  try {
    await softDeleteGaleri(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Album galeri berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
};

