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
    lupaHref: 'mailto:harapanjayasma@gmail.com?subject=Permintaan Reset Kata Sandi CMS',
    tombol: 'Masuk Dashboard',
    tombolProses: 'Memproses...',
    kembali: 'Kembali ke Halaman Publik Sekolah',
  },
  footer: {
    hakCipta: (tahun, nama, akreditasi, adiwiyata) => {
      const rawAkreditasi = akreditasi ? String(akreditasi).replace(/\.+$/, '') : ''
      const bagianAkreditasi = rawAkreditasi
        ? (rawAkreditasi.toLowerCase().startsWith('terakreditasi') ||
           rawAkreditasi.toLowerCase().startsWith('akreditasi') ||
           rawAkreditasi.toLowerCase().startsWith('belum')
            ? rawAkreditasi
            : `Terakreditasi ${rawAkreditasi}`)
        : 'Terakreditasi Unggul (A) BAN-S/M'
      const rawAdiwiyata = adiwiyata ? String(adiwiyata).replace(/\.+$/, '') : ''
      const bagianAdiwiyata = rawAdiwiyata || 'Sekolah Adiwiyata Mandiri'
      return `© ${tahun} ${nama}. Hak Cipta Dilindungi Undang-Undang. ${bagianAkreditasi}. ${bagianAdiwiyata}.`
    },
  },
}
