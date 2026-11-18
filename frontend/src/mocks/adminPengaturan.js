// Data dummy halaman Pengaturan. Sebagian besar sebaiknya disimpan di tabel `pengaturan_sekolah`
// (key-value). Daftar admin = tabel `users` (kolom `role`: 'superadmin' | 'subadmin').
// TODO: ganti dengan GET /api/pengaturan dan GET /api/admin.
export const mockPengaturan = {
  namaInstitusi: 'SMA Harapan Jaya',
  npsn: '20104829',
  akreditasi: 'A (Unggul) BAN-S/M',
  adiwiyata: 'Sekolah Adiwiyata Mandiri Nasional',
  slogan: 'Unggul, Berkarakter, Berwawasan Lingkungan Adiwiyata',
  logo: '',
  logoNama: 'Logo Resmi SMAHJ.svg',
  favicon: '',
  faviconNama: 'favicon.ico',
  email: 'info@smaharapanjaya.sch.id',
  telepon: '+62 21 8765-4321 / 0812-3456-7890',
  alamat: 'Jl. Pendidikan Raya No. 45, Harapan Jaya, Kec. Cipayung, Kota Administrasi Jakarta Timur, DKI Jakarta 13820',
  maintenance: false,
  ppdb: true,
  ppdbLink: '',
  ppdbTahunAjaran: '',
  ppdbTanggalTayang: '',
  ppdbTanggalMulai: '',
  ppdbTanggalSelesai: '',
  ppdbPengumuman: '',
}

export const idAdminSaatIni = 1

export const mockAdmin = [
  { id: 1, nama: 'Drs. Arya Gagah, S.Kom', tipeNomor: 'NIP', nomor: '19840115 200801 1 003', email: 'arya.gagah@smaharapanjaya.sch.id', role: 'superadmin', aktif: true },
  { id: 2, nama: 'Budi Santoso, S.Kom', tipeNomor: 'NIP', nomor: '19800214 200501 1 002', email: 'budi@smaharapanjaya.sch.id', role: 'subadmin', aktif: true },
  { id: 3, nama: 'Siti Rahmah, S.Pd', tipeNomor: 'NIP', nomor: '19890520 201402 2 001', email: 's.rahmah@smaharapanjaya.sch.id', role: 'subadmin', aktif: true },
  { id: 4, nama: 'Hendro Wicaksono, M.Sc', tipeNomor: 'NUPTK', nomor: '8943761663130091', email: 'hendro@smaharapanjaya.sch.id', role: 'subadmin', aktif: false },
]

// Informasi sesi login saat ini. IP dan jenis koneksi harus datang dari server.
export const mockSesi = {
  nama: 'Arya Gagah, S.Kom',
  peran: 'Super Admin',
  ip: '182.253.114.90',
  koneksi: 'Wired LAN',
  aktif: true,
}