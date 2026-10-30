/** @format */

import {
  createPesan,
  getAllPesan,
  getPesanById,
  updatePesanStatus,
} from "../services/pesan.service.js";

// Mengirim pesan dari pengunjung
export const kirimPesan = async (req, res, next) => {
  try {
    const data = await createPesan(req.body);

    return res.status(201).json({
      success: true,
      message: "Pesan berhasil dikirim",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Menampilkan semua pesan masuk
export const tampilkanPesan = async (req, res, next) => {
  try {
    const { status } = req.query;

    const data = await getAllPesan({ status });

    return res.status(200).json({
      success: true,
      message: "Data pesan masuk berhasil ditampilkan",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Menampilkan detail pesan berdasarkan ID
export const detailPesan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await getPesanById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Pesan tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Detail pesan berhasil ditampilkan",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Mengubah status pesan
export const ubahStatusPesan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, catatan_admin } = req.body;

    const statusValid = [
      "Belum Dibalas",
      "Sedang Diproses",
      "Selesai",
    ];

    if (!statusValid.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status pesan tidak valid",
      });
    }

    const data = await updatePesanStatus(id, {
      status,
      catatan_admin,
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Pesan tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status pesan berhasil diperbarui",
      data,
    });
  } catch (error) {
    next(error);
  }
};