// Data contoh halaman Overview. TODO: ganti dengan service ke API, mis. GET /api/dashboard/overview
// (aktivitas dari log, agenda dari tabel `agenda`, pesan dari tabel `pesan_masuk` berstatus belum dibalas).
export const dashboardOverview = {
  sapaan: 'Arya Gagah',
  tahunPelajaran: '2025/2026',
  catatan:
    'Portal berjalan normal. Terakhir sinkronisasi database kurikulum otomatis pukul 04:00 WIB tadi pagi.',

  // nada: hijau | biru | merah | kuning — meta[].tone: hijau | merah | oranye (opsional)
  aktivitas: [
    {
      id: 1,
      nada: 'hijau',
      ikon: 'note_add',
      aktor: 'Admin',
      aksi: 'menambahkan Berita Baru:',
      objek: '"Tim Robotik WRO Lolos Babak Nasional"',
      objekNada: 'hijau',
      waktu: '12 menit lalu',
      meta: [
        { label: 'Oleh', nilai: 'Arya Gagah' },
        { label: 'Kategori', nilai: 'Prestasi Siswa' },
        { label: 'Status', nilai: 'Diterbitkan', tone: 'hijau' },
      ],
    },
    {
      id: 2,
      nada: 'biru',
      ikon: 'edit_calendar',
      aktor: 'Humas',
      aksi: 'memperbarui Agenda:',
      objek: '"Rapat Pleno Komite & Wali Murid Kelas XII"',
      objekNada: 'biru',
      waktu: '45 menit lalu',
      meta: [
        { label: 'Oleh', nilai: 'Siti Rahmawati, S.Pd' },
        { label: 'Perubahan', nilai: 'Jam pelaksanaan dimundurkan ke 09.30 WIB' },
      ],
    },
    {
      id: 3,
      nada: 'merah',
      ikon: 'inbox',
      aktor: 'Pesan masuk baru dari Wali Murid:',
      aksi: '',
      objek: '"Permohonan Legalisir Ijazah 2023 Daring"',
      waktu: '2 jam lalu',
      meta: [
        { label: 'Pengirim', nilai: 'Bambang Hariyadi' },
        { nilai: 'Kotak Masuk PTSP' },
        { label: 'Status', nilai: 'Belum Dijawab', tone: 'merah' },
      ],
    },
    {
      id: 4,
      nada: 'kuning',
      ikon: 'add_photo_alternate',
      aktor: 'Wakasek Sarpras',
      aksi: 'mengunggah Foto:',
      objek: '"Renovasi Lab Bioteknologi Adiwiyata"',
      waktu: '4 jam lalu',
      meta: [
        { label: 'Oleh', nilai: 'Drs. M. Taufiq, M.M' },
        { nilai: 'Menambahkan 8 foto resolusi tinggi ke Galeri Sarana' },
      ],
    },
  ],

  // tanggal format ISO (YYYY-MM-DD) sesuai kolom tanggal_mulai di tabel agenda
  agenda: [
    { id: 1, tanggal: '2026-02-26', judul: 'Simulasi UTBK-SNBT 2026 Gel. 1', ikon: 'schedule', detail: '07.30 - 12.00 • Lab Komputer A & B' },
    { id: 2, tanggal: '2026-03-02', judul: 'Gelar Karya P5 & Adiwiyata Fest', ikon: 'location_on', detail: 'Lapangan Utama & Selasar Gedung' },
    { id: 3, tanggal: '2026-03-08', judul: 'Rapat Pleno Dewan Guru & Komite', ikon: 'videocam', detail: 'Hybrid: Aula Utama & Zoom' },
  ],

  // baru: true → kartu disorot & tombol Balas berwarna penuh
  pesan: [
    {
      id: 1,
      nama: 'Bambang Hariyadi',
      waktu: '10:14 WIB',
      isi: 'Mohon informasi syarat legalisir ijazah tahun kelulusan 2023 secara daring via...',
      kategori: 'PTSP Layanan Siswa',
      kategoriNada: 'hijau',
      baru: true,
    },
    {
      id: 2,
      nama: 'Nurul Inayah (Calon Siswa)',
      waktu: 'Kemarin',
      isi: 'Bagaimana ketentuan upload sertifikat juara taekwondo tingkat provinsi untuk jalur prestasi?',
      kategori: 'Helpdesk PPDB',
      kategoriNada: 'oranye',
      baru: false,
    },
  ],
}
