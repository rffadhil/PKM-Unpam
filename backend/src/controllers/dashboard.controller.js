/** @format */

import { getDashboardData } from "../services/dashboard.service.js";

export const getDashboardController = async (_req, res, next) => {
  try {
    const data = await getDashboardData();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
