
/** @format */

export const validateAgendaInput = (data) => {
  const errors = {};

  if (!data.judul || !String(data.judul).trim()) {
    errors.judul = "Judul agenda wajib diisi.";
  }

  if (!data.slug || !String(data.slug).trim()) {
    errors.slug = "Slug agenda wajib diisi.";
  }

  if (!data.tanggal_mulai) {
    errors.tanggal_mulai = "Tanggal mulai wajib diisi.";
  }

  if (data.tanggal_mulai && data.tanggal_selesai) {
    if (data.tanggal_selesai < data.tanggal_mulai) {
      errors.tanggal_selesai =
        "Tanggal selesai tidak boleh sebelum tanggal mulai.";
    }
  }

  if (Object.keys(errors).length > 0) {
    const error = new Error("Validasi data agenda gagal.");
    error.status = 400;
    error.errors = errors;

    throw error;
  }

  return {
    judul: String(data.judul).trim(),
    slug: String(data.slug).trim(),
    kategori: data.kategori || null,
    periode: data.periode || null,
    deskripsi: data.deskripsi || null,
    tanggal_mulai: data.tanggal_mulai,
    tanggal_selesai: data.tanggal_selesai || null,
    waktu: data.waktu || null,
    lokasi: data.lokasi || null,
    kapasitas_target: data.kapasitas_target || null,
    penyelenggara: data.penyelenggara || null,
  };
};
