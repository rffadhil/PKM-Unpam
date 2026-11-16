/** @format */

import {
  getAllPengaturan as getAllPengaturanService,
  getPortalPengaturanObject,
  getPengaturanByKey as getPengaturanByKeyService,
  upsertManyPengaturan,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  resetAdminPassword,
} from "../services/pengaturan.service.js";
import { validateTemporaryPasswordInput } from "../validators/auth.validator.js";

// GET semua pengaturan sekolah (+ objek portal, daftar admin, & info sesi)
export const getAllPengaturan = async (req, res) => {
  try {
    const [data, portal, admin] = await Promise.all([
      getAllPengaturanService(),
      getPortalPengaturanObject(),
      getAllAdmins(),
    ]);

    const rawIp =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      "127.0.0.1";
    const ip = rawIp === "::1" ? "127.0.0.1 (Localhost)" : rawIp;

    const sesi = {
      nama: req.user?.nama || "Administrator CMS",
      peran: /super/i.test(req.user?.role || "")
        ? "Super Admin Utama"
        : "Admin Portal",
      ip,
      koneksi: "Wired LAN / HTTPS",
      aktif: true,
    };

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil data pengaturan sekolah",
      data,
      portal,
      admin,
      sesi,
    });
  } catch (error) {
    console.error("Error getAllPengaturan:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil pengaturan sekolah",
    });
  }
};

// GET pengaturan berdasarkan key
export const getPengaturanByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const data = await getPengaturanByKeyService(key);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Pengaturan tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil pengaturan",
      data,
    });
  } catch (error) {
    console.error("Error getPengaturanByKey:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil pengaturan",
    });
  }
};

// PUT memperbarui beberapa pengaturan sekaligus
export const updatePengaturan = async (req, res) => {
  try {
    const settings = req.body;
    const portal = await upsertManyPengaturan(settings);

    return res.status(200).json({
      success: true,
      message: "Berhasil memperbarui pengaturan sekolah",
      data: portal,
      portal,
    });
  } catch (error) {
    console.error("Error updatePengaturan:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui pengaturan sekolah",
    });
  }
};

// CRUD Manajemen Admin
export const listAdminController = async (_req, res, next) => {
  try {
    const admin = await getAllAdmins();
    return res.status(200).json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
};

export const createAdminController = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const { temporaryPassword } = validateTemporaryPasswordInput({
      password:
        payload.sandi || payload.password || payload.kataSandi,
    });
    const created = await createAdmin({
      ...payload,
      sandi: temporaryPassword,
    });
    return res.status(201).json({
      success: true,
      message: "Akun admin baru dibuat.",
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminController = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const rawPassword =
      payload.sandi || payload.password || payload.kataSandi;
    const updated = await updateAdmin(
      req.params.id,
      rawPassword
        ? {
            ...payload,
            sandi: validateTemporaryPasswordInput({
              password: rawPassword,
            }).temporaryPassword,
          }
        : payload,
    );
    return res.status(200).json({
      success: true,
      message: "Data admin diperbarui.",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminController = async (req, res, next) => {
  try {
    await deleteAdmin(req.params.id, req.user?.id);
    return res.status(200).json({
      success: true,
      message: "Akun admin dihapus.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetAdminPasswordController = async (req, res, next) => {
  try {
    const { temporaryPassword } = await resetAdminPassword(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Sandi sementara berhasil dibuat.",
      data: { temporaryPassword },
    });
  } catch (error) {
    next(error);
  }
};
