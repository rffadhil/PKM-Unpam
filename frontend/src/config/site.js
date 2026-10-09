// Identitas sekolah — satu sumber data untuk TopBar, Footer, dan halaman lain.
// Nanti bisa diganti dengan data dari API (profil sekolah).
export const site = {
  nama: 'SMA Harapan Jaya',
  akreditasi: 'Akreditasi Unggul (A) BAN-S/M',
  akreditasiSingkat: 'Akreditasi A BAN-S/M',
  sebutan: 'Sekolah Adiwiyata Mandiri',
  deskripsi:
    'Mewujudkan insan beriman, berakhlak mulia, unggul dalam sains dan teknologi, serta berbudaya lingkungan hidup yang asri dan lestari.',
  npsn: '20108392',
  telepon: '(021) 7892-3401',
  teleponFooter: '(021) 7892-3401 / 7892-3402',
  email: 'info@smaharapanjaya.sch.id',
  alamat:
    'Jl. Harapan Indah No. 45, RT.04/RW.02, Kec. Harapan Baru, Kota Jakarta 13420',
  tahun: 2026,
  // Tautan eksternal — isi dengan URL asli
  sisUrl: '#',
  waPpdbUrl: 'https://wa.me/',
  mapsUrl: 'https://maps.google.com',
}

// Banner pengumuman di atas navbar. Nanti diambil dari pengumuman yang di-pin.
export const pengumumanUtama = {
  label: 'PPDB 2026/2027:',
  teks: 'Pendaftaran PPDB Jalur Prestasi & Zonasi TP 2026/2027 Resmi Dibuka Mulai 15 Mei 2026.',
  linkLabel: 'Lihat Panduan & Syarat',
  to: '/ppdb',
}
