
/** @format */

import {
  getAllAgenda,
  getAgendaById,
  createAgenda,
  updateAgenda,
  softDeleteAgenda,
} from "../services/agenda.service.js";

import { validateAgendaInput } from "../validators/agenda.validator.js";

// GET: Menampilkan semua agenda
export const listAgendaController = async (req, res, next) => {
  try {
    const agenda = await getAllAgenda(req.query);

    return res.status(200).json(agenda);
  } catch (error) {
    next(error);
  }
};

// GET: Menampilkan detail agenda
export const getAgendaController = async (req, res, next) => {
  try {
    const agenda = await getAgendaById(req.params.id);

    return res.status(200).json(agenda);
  } catch (error) {
    next(error);
  }
};

// POST: Membuat agenda baru
export const createAgendaController = async (req, res, next) => {
  try {
    const validated = validateAgendaInput(req.body);

    const created = await createAgenda(
      validated,
      req.user?.id,
    );

    return res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

// PUT: Mengubah agenda
export const updateAgendaController = async (req, res, next) => {
  try {
    const validated = validateAgendaInput(req.body);

    const updated = await updateAgenda(
      req.params.id,
      validated,
    );

    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE: Menghapus agenda
export const deleteAgendaController = async (req, res, next) => {
  try {
    await softDeleteAgenda(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Agenda berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
};
