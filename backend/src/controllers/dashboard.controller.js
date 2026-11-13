/** @format */

import { getDashboardData, getAktivitasPaginated } from "../services/dashboard.service.js";

export const getDashboardController = async (_req, res, next) => {
  try {
    const data = await getDashboardData();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getAktivitasController = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 5));
    const data = await getAktivitasPaginated(page, limit);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
