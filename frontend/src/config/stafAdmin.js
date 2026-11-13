/** @format */

// Konstanta halaman Profil & Staf (admin).
export const STAF_PER_HALAMAN = 5;
export const BATAS_FOTO_MB = 2;
export const BATAS_SAMBUTAN = 600;
export const BATAS_VISI = 300;

export const FILTER_STAF_AWAL = { kata: "", rumpun: "", status: "" };

export const RUMPUN_PTK = [
  "Pimpinan Sekolah",
  "Wakil Kepala Sekolah",
  "MIPA & Sains",
  "IPS & Bahasa",
  "Olahraga & Seni Budaya",
  "Agama & Bimbingan Konseling",
  "Tenaga Kependidikan / Tata Usaha",
];

// `nilai` dipakai untuk menyaring, `label` untuk tampilan.
export const STATUS_PEGAWAI = [
  { nilai: "GTY/PTY", label: "GTY/PTY (Tetap Yayasan)" },
  { nilai: "PNS", label: "PNS" },
  { nilai: "PPPK", label: "PPPK" },
  { nilai: "GTT", label: "GTT (Guru Tidak Tetap)" },
  { nilai: "Honorer", label: "Honorer" },
];

export const TIPE_NOMOR = ["NUPTK", "NIP"];

// Warna lencana jabatan. Dipilih otomatis dari rumpun, bisa ditimpa per orang di data.
export const JABATAN_TONE = {
  primary: "bg-primary text-white",
  hijau: "bg-secondary text-white",
  zaitun: "bg-tertiary-container text-tertiary-fixed",
  biru: "bg-blue-100 text-blue-900",
  abu: "bg-slate-200 text-primary",
};

export const TONE_RUMPUN = {
  "Pimpinan Sekolah": "primary",
  "Wakil Kepala Sekolah": "hijau",
  "MIPA & Sains": "hijau",
  "IPS & Bahasa": "abu",
  "Olahraga & Seni Budaya": "zaitun",
  "Agama & Bimbingan Konseling": "zaitun",
  "Tenaga Kependidikan / Tata Usaha": "biru",
};

export const JABATAN_KEPALA = "Kepala Sekolah";

export const GAYA_INPUT =
  "block w-full rounded-xl border border-border-muted bg-surface-white px-3.5 py-2.5 text-sm text-on-surface placeholder:text-text-muted/70 focus:border-secondary focus:ring-2 focus:ring-secondary/20";
