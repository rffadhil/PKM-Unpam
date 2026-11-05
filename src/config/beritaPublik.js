// Pengaturan halaman Berita publik (/berita).
export const PER_HALAMAN_PUBLIK = 6
export const SEMUA_BERITA = 'Semua Berita'
export const KATEGORI_PENGUMUMAN = 'Pengumuman Resmi'
export const MAKS_PENGUMUMAN_SIDEBAR = 3

// Opsi pengurutan: nilai ini juga dipakai di URL (?urut=terlama)
export const OPSI_URUT = [
  { nilai: 'terbaru', label: 'Paling Baru (Terbaru)' },
  { nilai: 'terlama', label: 'Paling Lama (Terlama)' },
]

// Kontak redaksi di kartu "Layanan Pers & Liputan Media".
// TODO: ganti dengan data asli dari sekolah (atau dari tabel pengaturan).
export const layananMedia = {
  email: 'redaksi.warta@smaharapanjaya.sch.id',
  teleponTampil: '+62 812-8899-7766',
  teleponLink: '+6281288997766',
  penanggungJawab: 'Bu Ratna - Humas',
}
