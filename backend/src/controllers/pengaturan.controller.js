import {
  getAllPengaturan as getAllPengaturanService,
  getPengaturanByKey as getPengaturanByKeyService,
  upsertManyPengaturan,
} from "../services/pengaturan.service.js";

// GET semua pengaturan sekolah
export const getAllPengaturan = async (req, res) => {
  try {
    const data = await getAllPengaturanService();

    return res.status(200).json({
      success: true,
      message: "Berhasil mengambil data pengaturan sekolah",
      data,
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

    if (
      !settings ||
      typeof settings !== "object" ||
      Array.isArray(settings) ||
      Object.keys(settings).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Data pengaturan harus berupa object dan tidak boleh kosong",
      });
    }

    const data = await upsertManyPengaturan(settings);

    return res.status(200).json({
      success: true,
      message: "Berhasil memperbarui pengaturan sekolah",
      data,
    });
  } catch (error) {
    console.error("Error updatePengaturan:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui pengaturan sekolah",
    });
  }
};