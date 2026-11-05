// Teks & tautan halaman login CMS. Dipisah dari komponen supaya mudah diganti
// (atau diambil dari API pengaturan_sekolah) tanpa menyentuh tampilan.
export const loginTeks = {
  topBar: {
    judul: 'PORTAL RESMI SATUAN PENDIDIKAN',
    statusServer: 'Server Aman SIS v4.2',
    bantuan: 'Bantuan Operator',
    bantuanHref: 'mailto:admin.it@smaharapanjaya.sch.id', // TODO: ganti kontak operator
  },
  brand: {
    judul: 'Portal Admin & CMS',
    subjudul: 'SMA Harapan Jaya - Publikasi & Tata Kelola Digital',
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
    info: 'Akses terbatas hanya untuk Kepala Sekolah, Tim Redaksi Publikasi, serta Tenaga Administrasi Terdaftar. Semua aktivitas login tercatat pada audit log.',
    kembali: 'Kembali ke Halaman Publik Sekolah',
  },
  footer: {
    hakCipta: (tahun, nama) =>
      `© ${tahun} ${nama}. Hak Cipta Dilindungi Undang-Undang. Terakreditasi Unggul (A) BAN-S/M. Sekolah Adiwiyata Mandiri.`,
    tautan: ['Visi Unggul & Adiwiyata', 'Biro Teknologi Informasi'],
  },
}
