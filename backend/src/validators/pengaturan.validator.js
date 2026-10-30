// Validasi data pengaturan sekolah
export const validatePengaturan = (req, res, next) => {
  const settings = req.body;

  // Pastikan data berupa object dan tidak kosong
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

  // Validasi key dan value
  for (const [key, value] of Object.entries(settings)) {
    if (typeof key !== "string" || key.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Key pengaturan tidak boleh kosong",
      });
    }

    if (value === null || value === undefined) {
      return res.status(400).json({
        success: false,
        message: `Value untuk ${key} tidak boleh kosong`,
      });
    }

    if (typeof value === "object") {
      return res.status(400).json({
        success: false,
        message: `Value untuk ${key} harus berupa teks atau angka`,
      });
    }
  }

  next();
};