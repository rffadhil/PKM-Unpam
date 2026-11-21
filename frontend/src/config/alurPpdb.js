export const ALUR_PPDB_DEFAULT = [
  {
    judul: "Isi Formulir Online",
    deskripsi:
      "Klik tombol pendaftaran dan lengkapi biodata calon siswa pada Google Form resmi sekolah.",
  },
  {
    judul: "Verifikasi Berkas",
    deskripsi:
      "Panitia PPDB akan menghubungi calon siswa untuk penjadwalan verifikasi dokumen di sekolah.",
  },
  {
    judul: "Daftar Ulang",
    deskripsi:
      "Selesaikan proses administrasi dan daftar ulang sesuai arahan dari panitia sekolah.",
  },
];

export function bacaAlurPpdb(nilai) {
  if (!nilai) return ALUR_PPDB_DEFAULT;

  try {
    const parsed = typeof nilai === "string" ? JSON.parse(nilai) : nilai;

    if (!Array.isArray(parsed)) return ALUR_PPDB_DEFAULT;

    return parsed.map((item) => ({
      judul: String(item?.judul || ""),
      deskripsi: String(item?.deskripsi || ""),
    }));
  } catch {
    return ALUR_PPDB_DEFAULT;
  }
}
