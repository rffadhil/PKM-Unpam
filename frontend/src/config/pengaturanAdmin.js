// Konstanta halaman Pengaturan Sistem & Portal Sekolah (admin).
export const AKREDITASI = [
  'A (Unggul) BAN-S/M',
  'B (Baik) BAN-S/M',
  'C (Cukup) BAN-S/M',
  'Belum Terakreditasi',
]

// Peran admin (RBAC) + warna pil.
export const ROLE_ADMIN = [
  { kunci: 'superadmin', label: 'Super Admin', tone: 'bg-secondary-container text-on-secondary-fixed-variant' },
  { kunci: 'admin-berita', label: 'Admin Berita & Publikasi', tone: 'bg-blue-100 text-blue-900' },
  { kunci: 'admin-galeri', label: 'Admin Galeri & Media', tone: 'bg-amber-100 text-amber-900' },
  { kunci: 'admin-ppdb', label: 'Admin PPDB & Kesiswaan', tone: 'bg-purple-100 text-purple-900' },
]

export const NOMOR_PENGGUNA = ['NIP', 'NUPTK']

// Bagian halaman yang tampil untuk tiap peran. Ubah di sini kalau pembagiannya berbeda:
// - superadmin: kelola semua admin ('akses')
// - admin (sub admin): hanya melihat sesinya sendiri ('sesi')
export const BAGIAN_PER_PERAN = {
  superadmin: ['identitas', 'kontak', 'portal', 'akses'],
  admin: ['identitas', 'kontak', 'portal', 'sesi'],
}

// Kata kunci tiap bagian, dipakai kolom cari di topbar ("Cari modul atau parameter...").
export const KATA_BAGIAN = {
  identitas: 'identitas sekolah portal publik nama npsn akreditasi adiwiyata slogan motto logo favicon aset visual',
  kontak: 'kontak resmi footer email telepon whatsapp kode pos alamat kampus',
  portal: 'mode pemeliharaan maintenance status portal ppdb pendaftaran online',
  akses: 'manajemen admin hak akses role rbac pengguna kredensial',
  sesi: 'manajemen admin sesi aktif keamanan ip timeout kata sandi',
}

export const BATAS_ASET_MB = 2
export const FORMAT_LOGO = ['svg', 'png']
export const FORMAT_FAVICON = ['ico', 'png', 'svg']

export const GAYA_INPUT =
  'block w-full rounded-xl border border-border-muted bg-surface-white px-3.5 py-2.5 text-sm text-on-surface placeholder:text-text-muted/70 focus:border-secondary focus:ring-2 focus:ring-secondary/20'
