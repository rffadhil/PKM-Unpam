
/** @format */

import { validateStaf } from "../validators/staf.validator.js";

import {
  getAllStaf,
  getStafById,
  createStaf,
  updateStaf,
  deleteStaf,
} from "../services/staf.service.js";

// GET semua staf
export const getStaf = async (req, res) => {
  try {
    const data = await getAllStaf();

    return res.status(200).json({
      success: true,
      message: "Data staf berhasil diambil",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data staf",
      error: error.message,
    });
  }
};

// GET staf berdasarkan ID
export const getStafDetail = async (req, res) => {
  try {
    const data = await getStafById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data staf tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data staf berhasil ditemukan",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil detail staf",
      error: error.message,
    });
  }
};

// POST tambah staf
export const tambahStaf = async (req, res) => {
  try {
    const payload = {
      nama: req.body.nama,
      nip_nuptk: req.body.nip_nuptk,
      jabatan: req.body.jabatan,
      rumpun: req.body.rumpun,
      mata_pelajaran: req.body.mata_pelajaran,
      foto_url: req.body.foto_url,

      pendidikan_terakhir: req.body.pendidikan_terakhir ?? "",
      almamater: req.body.almamater ?? "",
      status_kepegawaian: req.body.status_kepegawaian ?? "",

      urutan: req.body.urutan ?? 0,
      tampil_publik: req.body.tampil_publik ?? true,
    };

    const { isValid, errors } = validateStaf(payload);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Data staf tidak valid",
        errors,
      });
    }

    const data = await createStaf(payload);

    return res.status(201).json({
      success: true,
      message: "Data staf berhasil ditambahkan",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menambahkan data staf",
      error: error.message,
    });
  }
};

// PUT ubah staf
export const ubahStaf = async (req, res) => {
  try {
    const payload = {
      nama: req.body.nama,
      nip_nuptk: req.body.nip_nuptk,
      jabatan: req.body.jabatan,
      rumpun: req.body.rumpun,
      mata_pelajaran: req.body.mata_pelajaran,
      foto_url: req.body.foto_url,

      pendidikan_terakhir: req.body.pendidikan_terakhir ?? "",
      almamater: req.body.almamater ?? "",
      status_kepegawaian: req.body.status_kepegawaian ?? "",

      urutan: req.body.urutan ?? 0,
      tampil_publik: req.body.tampil_publik ?? true,
    };

    const { isValid, errors } = validateStaf(payload);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Data staf tidak valid",
        errors,
      });
    }

    const data = await updateStaf(req.params.id, payload);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data staf tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data staf berhasil diperbarui",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui data staf",
      error: error.message,
    });
  }
};

// DELETE hapus staf
export const hapusStaf = async (req, res) => {
  try {
    const data = await deleteStaf(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data staf tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data staf berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus data staf",
      error: error.message,
    });
  }
};
