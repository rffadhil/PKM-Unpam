
/** @format */

import fs from "fs";
import path from "path";

import { validateDokumenInput } from "../validators/dokumen.validator.js";


import {
  getAllDokumen,
  getAllDokumenAdmin,
  getDokumenById,
  createDokumen,
  updateDokumen,
  softDeleteDokumen,
  incrementJumlahUnduhan,
} from "../services/dokumen.service.js";


// GET: Menampilkan semua dokumen
export const listDokumenController = async (req, res, next) => {
  try {
    const dokumen = await getAllDokumen(req.query);

    return res.status(200).json({
      success: true,
      data: dokumen,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * GET: Menampilkan daftar dokumen untuk admin
 * Endpoint: GET /api/dokumen/admin
 */
export const listDokumenAdminController = async (
  req,
  res,
  next,
) => {
  try {
    const dokumen = await getAllDokumenAdmin(
      req.query,
    );

    return res.status(200).json({
      success: true,
      message: "Daftar dokumen admin berhasil diambil.",
      data: dokumen,
    });
  } catch (error) {
    next(error);
  }
};


// GET: Menampilkan detail dokumen
export const getDokumenController = async (req, res, next) => {
  try {
    const dokumen = await getDokumenById(req.params.id);

    return res.status(200).json({
      success: true,
      data: dokumen,
    });
  } catch (error) {
    next(error);
  }
};

// POST: Upload dokumen baru
export const createDokumenController = async (req, res, next) => {
  try {
    const validated = validateDokumenInput(req.body);

    const created = await createDokumen(
      validated,
      req.file,
      req.user?.id,
    );

    return res.status(201).json({
      success: true,
      message: "Dokumen berhasil diunggah.",
      data: created,
    });
  } catch (error) {
    // Jika upload gagal setelah file tersimpan,
    // hapus file agar tidak menjadi file yatim.
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    next(error);
  }
};

// PUT: Mengubah informasi dokumen
export const updateDokumenController = async (req, res, next) => {
  try {
    const validated = validateDokumenInput(req.body, true);

    const updated = await updateDokumen(
      req.params.id,
      validated,
      req.file,
    );

    return res.status(200).json({
      success: true,
      message: "Dokumen berhasil diperbarui.",
      data: updated,
    });
  } catch (error) {
    // Hapus file baru jika proses update gagal.
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    next(error);
  }
};

// DELETE: Menghapus dokumen
export const deleteDokumenController = async (req, res, next) => {
  try {
    await softDeleteDokumen(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Dokumen berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
};

// GET: Download dokumen
export const downloadDokumenController = async (
  req,
  res,
  next,
) => {
  try {
    const dokumen = await getDokumenById(req.params.id);

    // Ambil nama file dari file_url
    const filename = path.basename(dokumen.file_url);

    // Tentukan lokasi file
    const filePath = path.resolve(
      process.cwd(),
      "uploads",
      "dokumen",
      filename,
    );

    // Periksa apakah file tersedia
    if (!fs.existsSync(filePath)) {
      const error = new Error("File dokumen tidak ditemukan.");
      error.status = 404;
      throw error;
    }

    // Tambahkan jumlah unduhan
    await incrementJumlahUnduhan(req.params.id);

    // Kirim file ke pengguna
    return res.download(
      filePath,
      filename,
      (error) => {
        if (error && !res.headersSent) {
          next(error);
        }
      },
    );
  } catch (error) {
    next(error);
  }
};



