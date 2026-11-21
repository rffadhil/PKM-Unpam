/** @format */

import {
  getAllEkstrakurikuler,
  getEkstrakurikulerById,
  createEkstrakurikuler,
  updateEkstrakurikuler,
  deleteEkstrakurikuler,
} from "../services/ekstrakurikuler.service.js";

import {
  validateEkstrakurikulerInput,
} from "../validators/ekstrakurikuler.validator.js";

// GET: DAFTAR EKSTRAKURIKULER
export const listEkstrakurikulerController = async (req, res, next) => {
  try {
    const data = await getAllEkstrakurikuler(req.query);

    res.status(200).json({
      success: true,
      message: "Data ekstrakurikuler berhasil diambil.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// GET: DETAIL EKSTRAKURIKULER
export const getEkstrakurikulerController = async (req, res, next) => {
  try {
    const data = await getEkstrakurikulerById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Detail ekstrakurikuler berhasil diambil.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// POST: TAMBAH EKSTRAKURIKULER
export const createEkstrakurikulerController = async (
  req,
  res,
  next
) => {
  try {
    const validated = validateEkstrakurikulerInput(req.body);

    const data = await createEkstrakurikuler(
      validated,
      req.user?.id
    );

    res.status(201).json({
      success: true,
      message: "Ekstrakurikuler berhasil ditambahkan.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// PUT: UPDATE EKSTRAKURIKULER
export const updateEkstrakurikulerController = async (
  req,
  res,
  next
) => {
  try {
    const validated = validateEkstrakurikulerInput(req.body);

    const data = await updateEkstrakurikuler(
      req.params.id,
      validated
    );

    res.status(200).json({
      success: true,
      message: "Ekstrakurikuler berhasil diperbarui.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE: HAPUS PERMANEN EKSTRAKURIKULER
export const deleteEkstrakurikulerController = async (
  req,
  res,
  next
) => {
  try {
    await deleteEkstrakurikuler(req.params.id);

    res.status(200).json({
      success: true,
      message: "Ekstrakurikuler berhasil dihapus permanen.",
    });
  } catch (error) {
    next(error);
  }
};