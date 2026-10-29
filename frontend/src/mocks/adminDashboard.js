// DATA DUMMY halaman Overview CMS. Ganti dengan respons API (endpoint ringkasan dashboard).
// Catatan sumber data yang belum ada di PRD/ERD:
//  - kunjungan & pembaca  → analitik (Vercel Analytics / GA) atau tabel kunjungan sendiri
//  - aktivitas/log sistem → tabel log_aktivitas
//  - pesan masuk          → pesan_masuk perlu kolom status, kategori kotak (PTSP/Helpdesk PPDB), balasan

export const statusPortal =
  'Portal berjalan normal. Terakhir sinkronisasi database kurikulum otomatis pukul 04:00 WIB tadi pagi.'

// Jumlah artikel dihitung dari daftar yang sama dengan halaman Berita (satu sumber data).
export function hitungRingkasanBerita(daftar) {
  return { total: daftar.length }
}

export const ringkasanLain = {
  kunjungan: { total: 48250, perubahan: '+12.4%', pembanding: 'vs bulan lalu' },
  agenda: { total: 14, pekanIni: 3, darurat: 1 },
  pesan: { belumDibalas: 3, totalDiterima: 126 },
}

// ---- Grafik tren (1–24 Feb 2026; hari ini = 24 Feb) ----
const PENGUNJUNG_30 = [1048, 1100, 1173, 1256, 1339, 1411, 1463, 1484, 1453, 1390, 1328, 1297, 1349, 1473, 1681, 1971, 2283, 2410, 2345, 2023, 1712, 1577, 1764, 2262]
const PEMBACA_30 = [608, 627, 704, 741, 817, 847, 849, 920, 915, 848, 797, 765, 836, 943, 1059, 1222, 1393, 1591, 1477, 1214, 993, 899, 1041, 1380]

const DURASI_DAN_POPULER = { artikelPopuler: 'Juknis PPDB 2026', durasiSesi: '3m 42s' }

export const rentangGrafik = [
  {
    kunci: '30',
    label: '30 Hari Terakhir',
    pengunjung: PENGUNJUNG_30,
    pembaca: PEMBACA_30,
    labelX: ['01 Feb', '06 Feb', '12 Feb', '18 Feb (Peluncuran PPDB)', '24 Feb (Hari Ini)'],
    puncak: { teks: 'Puncak PPDB', tanggal: '18 Februari 2026' },
    ...DURASI_DAN_POPULER,
  },
  {
    kunci: '7',
    label: '7 Hari Terakhir',
    pengunjung: PENGUNJUNG_30.slice(-7),
    pembaca: PEMBACA_30.slice(-7),
    labelX: ['18 Feb', '20 Feb', '21 Feb', '23 Feb', '24 Feb (Hari Ini)'],
    puncak: { teks: 'Puncak PPDB', tanggal: '18 Februari 2026' },
    ...DURASI_DAN_POPULER,
  },
  {
    kunci: 'semester',
    label: 'Semester Ini',
    // per pekan, 5 Jan – 23 Feb 2026
    pengunjung: [6420, 7100, 7650, 8380, 9120, 10440, 14210, 11260],
    pembaca: [3710, 4150, 4480, 4920, 5400, 6230, 8890, 6720],
    labelX: ['05 Jan', '19 Jan', '02 Feb', '16 Feb (Puncak PPDB)', '23 Feb'],
    puncak: { teks: 'Pekan puncak PPDB', tanggal: '16 – 22 Februari 2026' },
    labelRata: 'Rata-rata Per Pekan',
    ...DURASI_DAN_POPULER,
  },
]

// ---- Agenda terdekat ----
// warnaBulan: kelas untuk label bulan pada kotak tanggal
export const agendaTerdekat = [
  { id: 1, bulan: 'FEB', tanggal: '26', judul: 'Simulasi UTBK-SNBT 2026 Gel. 1', ikon: 'schedule', info: '07.30 - 12.00 • Lab Komputer A & B', warnaBulan: 'bg-[#90B800] text-primary' },
  { id: 2, bulan: 'MAR', tanggal: '02', judul: 'Gelar Karya P5 & Adiwiyata Fest', ikon: 'location_on', info: 'Lapangan Utama & Selasar Gedung', warnaBulan: 'bg-secondary text-white' },
  { id: 3, bulan: 'MAR', tanggal: '08', judul: 'Rapat Pleno Dewan Guru & Komite', ikon: 'videocam', info: 'Hybrid: Aula Utama & Zoom', warnaBulan: 'bg-secondary text-white' },
]

// ---- Pesan masuk belum diproses (2 teratas; jumlah total di ringkasanLain.pesan) ----
export const pesanTerbaru = [
  {
    id: 101,
    pengirim: 'Bambang Hariyadi',
    waktu: '10:14 WIB',
    isi: 'Mohon informasi syarat legalisir ijazah tahun kelulusan 2023 secara daring via portal resmi...',
    kotak: 'PTSP Layanan Siswa',
    mendesak: true,
  },
  {
    id: 102,
    pengirim: 'Nurul Inayah (Calon Siswa)',
    waktu: 'Kemarin',
    isi: 'Bagaimana ketentuan upload sertifikat juara taekwondo tingkat provinsi untuk jalur prestasi PPDB?',
    kotak: 'Helpdesk PPDB',
    mendesak: false,
  },
]

// ---- Log aktivitas terkini ----
// tone: hijau | biru | merah | kuning. detail = potongan teks (tebal / berwarna opsional)
export const aktivitasTerkini = [
  {
    id: 1,
    ikon: 'post_add',
    tone: 'hijau',
    judul: 'Admin menambahkan Berita Baru: ',
    sorot: '"Tim Robotik WRO Lolos Babak Nasional"',
    sorotClass: 'text-secondary',
    waktu: '12 menit lalu',
    detail: [
      { teks: 'Oleh: ' },
      { teks: 'Arya Gagah', tebal: true },
      { teks: ' • Kategori: Prestasi Siswa • Status: ' },
      { teks: 'Diterbitkan', kelas: 'text-emerald-700 font-semibold' },
    ],
  },
  {
    id: 2,
    ikon: 'edit_calendar',
    tone: 'biru',
    judul: 'Humas memperbarui Agenda: ',
    sorot: '"Rapat Pleno Komite & Wali Murid Kelas XII"',
    sorotClass: 'text-blue-900',
    waktu: '45 menit lalu',
    detail: [
      { teks: 'Oleh: ' },
      { teks: 'Siti Rahmawati, S.Pd', tebal: true },
      { teks: ' • Perubahan: Jam pelaksanaan dimundurkan ke 09.30 WIB' },
    ],
  },
  {
    id: 3,
    ikon: 'inbox',
    tone: 'merah',
    judul: 'Pesan masuk baru dari Wali Murid: ',
    sorot: '"Permohonan Legalisir Ijazah 2023 Daring"',
    sorotClass: 'text-on-surface',
    waktu: '2 jam lalu',
    detail: [
      { teks: 'Pengirim: ' },
      { teks: 'Bambang Hariyadi', tebal: true },
      { teks: ' • Kotak Masuk PTSP • Status: ' },
      { teks: 'Belum Dijawab', kelas: 'text-error font-semibold' },
    ],
  },
  {
    id: 4,
    ikon: 'add_photo_alternate',
    tone: 'kuning',
    judul: 'Wakasek Sarpras mengunggah Foto: ',
    sorot: '"Renovasi Lab Bioteknologi Adiwiyata"',
    sorotClass: 'text-on-surface',
    waktu: '4 jam lalu',
    detail: [
      { teks: 'Oleh: ' },
      { teks: 'Drs. M. Taufiq, M.M', tebal: true },
      { teks: ' • Menambahkan 8 foto resolusi tinggi ke Galeri Sarana' },
    ],
  },
]
