/** @format */

export const validateGaleriInput = (data) => {
  const errors = {};

  const judul = data.judul || data.judul_foto;
  if (!judul || !String(judul).trim()) {
    errors.judul = "Judul album wajib diisi.";
  }

  const kategori = data.kategori ? String(data.kategori).trim() : "Adiwiyata";
  if (!kategori) {
    errors.kategori = "Kategori album wajib diisi.";
  }

  if (Object.keys(errors).length > 0) {
    const error = new Error("Validasi data galeri album gagal.");
    error.status = 400;
    error.errors = errors;
    throw error;
  }

  const jumlahFotoNum = parseInt(data.jumlah_foto ?? data.jumlahFoto ?? 1, 10);
  const coverUrl = data.image_url || data.cover || data.gambar || "";
  const penyelenggara = data.penyelenggara || data.pengunggah || "Admin Sekolah";
  const status = String(data.status || "tayang").toLowerCase();

  return {
    judul_foto: String(judul).trim(),
    kategori,
    deskripsi: data.deskripsi ? String(data.deskripsi).trim() : "",
    image_url: String(coverUrl).trim(),
    jumlah_foto: isNaN(jumlahFotoNum) || jumlahFotoNum < 0 ? 1 : jumlahFotoNum,
    pengunggah: String(penyelenggara).trim(),
    status,
    tanggal: data.tanggal ? String(data.tanggal).trim().slice(0, 10) : null,
  };
};

