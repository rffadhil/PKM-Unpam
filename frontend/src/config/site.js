// Identitas sekolah — satu sumber data untuk TopBar, Footer, dan halaman lain.
// Nanti bisa diganti dengan data dari API (profil sekolah).
export const site = {
  nama: 'SMA Harapan Jaya',
  akreditasi: 'Akreditasi Unggul (A) BAN-S/M',
  akreditasiSingkat: 'Akreditasi A BAN-S/M',
  sebutan: 'Sekolah Adiwiyata Mandiri',
  deskripsi:
    'Mewujudkan insan beriman, berakhlak mulia, unggul dalam sains dan teknologi, serta berbudaya lingkungan hidup yang asri dan lestari.',
  npsn: '20101350',
  telepon: '(021) 540-1920',
  teleponFooter: '(021) 540-1920',
  email: 'info@smaharapanjaya.sch.id',
  alamat:
    'Jl. Daan Mogot KM. 13, RT.07/RW.01, Kec. Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11730',
  tahun: 2026,
  // Tautan eksternal — isi dengan URL asli
  sisUrl: '#',
  waPpdbUrl: 'https://wa.me/',
  mapsUrl: 'https://maps.app.goo.gl/v7pvBYsepADott6NA',
}

// Banner pengumuman di atas navbar. Nanti diambil dari pengumuman yang di-pin.
export const pengumumanUtama = {
  label: 'PPDB 2026/2027:',
  teks: 'Pendaftaran PPDB Jalur Prestasi & Zonasi TP 2026/2027 Resmi Dibuka Mulai 15 Mei 2026.',
  linkLabel: 'Lihat Panduan & Syarat',
  to: '/ppdb',
}
