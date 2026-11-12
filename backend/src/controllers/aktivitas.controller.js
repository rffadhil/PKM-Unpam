
import { getAktivitasData } from "../services/aktivitas.service.js";

export const getAktivitasController = async (req, res, next) => {
  try {
    const {
      search = "",
      jenis = "",
      page = 1,
      limit = 10,
      tanggalMulai = "",
      tanggalSelesai = "",
    } = req.query;

    const data = await getAktivitasData({
      search,
      jenis,
      page,
      limit,
      tanggalMulai,
      tanggalSelesai,
    });

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    next(error);
  }
};
