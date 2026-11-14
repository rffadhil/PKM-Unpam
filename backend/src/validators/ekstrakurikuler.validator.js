
/** @format */

export const validateEkstrakurikulerInput = (data) => {
  const errors = {};

  const nama = data.nama;
  const pembina = data.pembina;
  const fotoUrl = data.foto_url || data.foto || "";
  const status = String(data.status || "tayang").toLowerCase();

  if (!nama || !String(nama).trim()) {
    errors.nama = "Nama ekstrakurikuler wajib diisi.";
  }

  if (!pembina || !String(pembina).trim()) {
    errors.pembina = "Nama pembina wajib diisi.";
  }

  if (!["tayang", "draft"].includes(status)) {
    errors.status = "Status harus tayang atau draft.";
  }

  if (Object.keys(errors).length > 0) {
    const error = new Error("Validasi ekstrakurikuler gagal.");
    error.status = 400;
    error.errors = errors;
    throw error;
  }

  return {
    nama: String(nama).trim(),
    pembina: String(pembina).trim(),
    foto_url: String(fotoUrl).trim(),
    status,
  };
};
