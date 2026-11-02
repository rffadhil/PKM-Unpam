
/** @format */

export const validateDokumenInput = (data, partial = false) => {
  const errors = {};

  // Nama dokumen wajib diisi saat membuat dokumen
  if (!partial && (!data.nama_dokumen || !String(data.nama_dokumen).trim())) {
    errors.nama_dokumen = "Nama dokumen wajib diisi.";
  }

  // Validasi panjang nama dokumen
  if (
    data.nama_dokumen !== undefined &&
    String(data.nama_dokumen).trim().length > 255
  ) {
    errors.nama_dokumen =
      "Nama dokumen maksimal 255 karakter.";
  }

  // Validasi kategori
  if (
    data.kategori !== undefined &&
    String(data.kategori).length > 100
  ) {
    errors.kategori =
      "Kategori dokumen maksimal 100 karakter.";
  }

  // Validasi status publikasi
  if (
    data.status_publikasi !== undefined &&
    String(data.status_publikasi).length > 50
  ) {
    errors.status_publikasi =
      "Status publikasi maksimal 50 karakter.";
  }


  // Validasi nilai status publikasi
  if (data.status_publikasi !== undefined) {
    const allowedStatus = [
      "Aktif di SIS",
      "Draft",
      "Arsip",
    ];

    if (
      !allowedStatus.includes(
        String(data.status_publikasi).trim(),
      )
    ) {
      errors.status_publikasi =
        "Status publikasi tidak valid.";
    }
  }


  // Validasi tombol utama
  if (
    data.tampil_tombol_utama !== undefined &&
    !["true", "false", true, false].includes(
      data.tampil_tombol_utama,
    )
  ) {
    errors.tampil_tombol_utama =
      "Tampil tombol utama harus berupa true atau false.";
  }

  // Jika ditemukan error, hentikan proses
  if (Object.keys(errors).length > 0) {
    const error = new Error("Validasi data dokumen gagal.");

    error.status = 400;
    error.errors = errors;

    throw error;
  }

  return {
    ...(data.nama_dokumen !== undefined && {
      nama_dokumen: String(data.nama_dokumen).trim(),
    }),

    ...(data.kategori !== undefined && {
      kategori: String(data.kategori).trim(),
    }),

    ...(data.deskripsi !== undefined && {
      deskripsi: data.deskripsi
        ? String(data.deskripsi).trim()
        : null,
    }),

    ...(data.status_publikasi !== undefined && {
      status_publikasi: String(data.status_publikasi).trim(),
    }),

    ...(data.tampil_tombol_utama !== undefined && {
      tampil_tombol_utama:
        data.tampil_tombol_utama === "true" ||
        data.tampil_tombol_utama === true,
    }),
  };
};
