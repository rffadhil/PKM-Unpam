// Mock data Dashboard Overview.
// Bentuk data sengaja dibuat mirip response API nanti, jadi saat backend siap
// cukup ganti isi fungsi di services/dashboardService.js.

export const currentUser = {
  nama: 'Arya Gagah',
  gelar: 'Drs. Arya Gagah, S.Kom',
  role: 'Super Admin',
  jabatan: 'Staf IT Utama',
  inisial: 'AG',
}

export const dashboardMock = {
  tahunPelajaran: '2025/2026',
  tanggal: '2026-02-24',
  notifikasi: 2,

  stats: {
    kunjungan: { total: 48250, persen: 12.4 },
    berita: { total: 48, tayang: 42, draf: 6 },
    agenda: { total: 14, pekanIni: 3, darurat: 1 },
    pesan: { belumDibalas: 3, total: 126 },
  },

  trend: {
    labels: ['01 Feb', '06 Feb', '12 Feb', '18 Feb (Peluncuran PPDB)', '24 Feb (Hari Ini)'],
    pengunjung: [12, 22, 38, 52, 46, 34, 40, 78, 96, 70, 36, 30, 52, 98],
    pembaca: [8, 14, 20, 30, 34, 26, 30, 52, 70, 54, 28, 22, 34, 62],
    puncak: { index: 8, teks: 'Puncak PPDB: 2.410 Pengunjung', tanggal: '18 Februari 2026' },
    ringkasan: {
      rataHarian: '1.608 Sesi',
      artikelTerbaik: 'Juknis PPDB 2026',
      durasi: '3m 42s',
    },
  },

  agenda: [
    { id: 1, bulan: 'FEB', tanggal: '26', judul: 'Simulasi UTBK-SNBT 2026 Gel. 1', waktu: '07.30 - 12.00', lokasi: 'Lab Komputer A & B', tipe: 'jam' },
    { id: 2, bulan: 'MAR', tanggal: '02', judul: 'Gelar Karya P5 & Adiwiyata Fest', waktu: '', lokasi: 'Lapangan Utama & Selasar Gedung', tipe: 'lokasi' },
    { id: 3, bulan: 'MAR', tanggal: '08', judul: 'Rapat Pleno Dewan Guru & Komite', waktu: '', lokasi: 'Hybrid: Aula Utama & Zoom', tipe: 'online' },
  ],

  pesan: [
    {
      id: 1,
      pengirim: 'Bambang Hariyadi',
      waktu: '10:14 WIB',
      isi: 'Mohon informasi syarat legalisir ijazah tahun kelulusan 2023 secara daring via…',
      kotak: 'PTSP Layanan Siswa',
    },
    {
      id: 2,
      pengirim: 'Nurul Inayah (Calon Siswa)',
      waktu: 'Kemarin',
      isi: 'Bagaimana ketentuan upload sertifikat juara taekwondo tingkat provinsi untuk jalur prestasi?',
      kotak: 'Helpdesk PPDB',
    },
  ],

  aktivitas: [
    {
      id: 1,
      jenis: 'berita',
      judul: 'Admin menambahkan Berita Baru:',
      sorot: 'Tim Robotik SMA Harapan Jaya Lolos Babak Nasional',
      waktu: '12 menit lalu',
      detail: 'Oleh: Arya Gagah • Kategori: Prestasi Siswa • Status:',
      status: { teks: 'Diterbitkan', tone: 'ok' },
    },
    {
      id: 2,
      jenis: 'agenda',
      judul: 'Humas memperbarui Agenda:',
      sorot: 'Rapat Pleno Komite & Wali Murid Kelas XII',
      waktu: '45 menit lalu',
      detail: 'Oleh: Siti Rahmawati, S.Pd • Perubahan: Jam pelaksanaan dimundurkan ke 09.30 WIB',
    },
    {
      id: 3,
      jenis: 'pesan',
      judul: 'Pesan masuk baru dari Wali Murid:',
      sorot: 'Permohonan Legalisir Ijazah 2023 Daring',
      waktu: '2 jam lalu',
      detail: 'Pengirim: Bambang Hariyadi • Kotak Masuk PTSP • Status:',
      status: { teks: 'Belum Dijawab', tone: 'bad' },
    },
    {
      id: 4,
      jenis: 'galeri',
      judul: 'Wakasek Sarpras mengunggah Foto:',
      sorot: 'Renovasi Lab Bioteknologi Adiwiyata',
      waktu: '4 jam lalu',
      detail: 'Oleh: Drs. M. Taufiq, M.M • Menambahkan 8 foto resolusi tinggi ke Galeri Sarana',
    },
  ],

  sistem: {
    storage: { terpakaiGB: 14.2, totalGB: 50 },
    database: { persenSehat: 98.4 },
    status: 'Optimal',
    info: [
      { label: 'Versi PHP / Engine:', nilai: 'PHP 8.3 / LiteSpeed' },
      { label: 'Backup Terakhir:', nilai: '24 Feb 2026, 03:00 WIB' },
      { label: 'SSL / Enkripsi:', nilai: 'Aktif (Let’s Encrypt Wildcard)', hijau: true },
    ],
  },
}
