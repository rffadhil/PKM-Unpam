// Teks & tautan halaman login CMS. Dipisah dari komponen supaya mudah diganti
// (atau diambil dari API pengaturan_sekolah) tanpa menyentuh tampilan.
export const loginTeks = {
  topBar: {
    judul: 'PORTAL RESMI SATUAN PENDIDIKAN',
  },
  brand: {
    judul: 'SMA Harapan Jaya',
    subjudul: 'Yayasan Al-Ittihad Jakarta Barat',
  },
  kartu: {
    judul: 'Masuk ke Dashboard CMS',
    subjudul: 'Gunakan kredensial resmi staf IT / Administrator sekolah',
    labelEmail: 'Email Pengguna / NIP',
    placeholderEmail: 'nama@smaharapanjaya.sch.id',
    labelSandi: 'Kata Sandi',
    placeholderSandi: 'Masukkan kata sandi',
    ingat: 'Ingat sesi saya di perangkat ini',
    lupa: 'Lupa kata sandi? Hubungi Tim IT',
    lupaHref: 'mailto:admin.it@smaharapanjaya.sch.id', // TODO: ganti kontak Tim IT
    tombol: 'Masuk Dashboard',
    tombolProses: 'Memproses...',
    kembali: 'Kembali ke Halaman Publik Sekolah',
  },
  footer: {
    hakCipta: (tahun, nama) =>
      `© ${tahun} ${nama}. Hak Cipta Dilindungi Undang-Undang. Terakreditasi Unggul (A) BAN-S/M. Sekolah Adiwiyata Mandiri.`,
  },
}
