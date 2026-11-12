
/** @format */

import {
  getAllGaleri,
  getGaleriById,
  createGaleri,
  updateGaleri,
  softDeleteGaleri,
  tambahFotoGaleri,
} from "../services/galeri.service.js";

import { validateGaleriInput } from "../validators/galeri.validator.js";

// ==========================================
// GET: Menampilkan seluruh album galeri
// ==========================================
export const listGaleriController = async (req, res, next) => {
  try {
    const list = await getAllGaleri(req.query);

    return res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET: Detail album beserta foto
// ==========================================
export const getGaleriController = async (req, res, next) => {
  try {
    const item = await getGaleriById(req.params.id);

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// POST: Membuat album baru
// ==========================================
export const createGaleriController = async (req, res, next) => {
  try {
    const validated = validateGaleriInput(req.body);

    const created = await createGaleri(
      validated,
      req.user?.id
    );

    return res.status(201).json({
      success: true,
      message: "Album galeri berhasil dibuat.",
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// PUT: Mengubah data album
// ==========================================
export const updateGaleriController = async (req, res, next) => {
  try {
    const validated = validateGaleriInput(req.body);

    const updated = await updateGaleri(
      req.params.id,
      validated
    );

    return res.status(200).json({
      success: true,
      message: "Album galeri berhasil diperbarui.",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE: Menghapus album
// ==========================================
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

// ==========================================
// POST: Menambahkan banyak foto ke album
// ==========================================
export const tambahFotoGaleriController = async (req, res, next) => {
  try {
    const { fotos } = req.body;

    if (!Array.isArray(fotos) || fotos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Data fotos harus berupa array dan tidak boleh kosong.",
      });
    }

    const updated = await tambahFotoGaleri(
      req.params.id,
      fotos
    );

    return res.status(201).json({
      success: true,
      message: "Foto berhasil ditambahkan ke album.",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
