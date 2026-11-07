// Data dummy album galeri. Taruh foto sampul di public/images/galeri/ (nama file bebas,
// sesuaikan di sini). Kalau file belum ada, kartu otomatis menampilkan sampul pengganti.
// TODO: ganti dengan GET /api/galeri (tabel `galeri`).
const cover = (nama) => `/images/galeri/${nama}.jpg`

export const mockAlbum = [
  { id: 1, judul: 'Panen Raya Hidroponik & Revitalisasi Bioporin Sekolah', kategori: 'Adiwiyata', deskripsi: 'Dokumentasi program aksi lingkungan hidup Adiwiyata Mandiri siswa kelas X & XI', tanggal: '2026-05-12', penyelenggara: 'Tim Adiwiyata', status: 'tayang', jumlahFoto: 18, cover: cover('hidroponik') },
  { id: 2, judul: 'Penganugerahan Juara Umum OSN & Festival Sains Nasional', kategori: 'Prestasi', deskripsi: 'Penyambutan delegasi tim olimpiade sains nasional bidang Fisika, Kimia, dan Biologi', tanggal: '2026-05-08', penyelenggara: 'Humas Sekolah', status: 'tayang', jumlahFoto: 24, cover: cover('osn') },
  { id: 3, judul: 'Praktikum Kimia Organik & Bioteknologi Terapan', kategori: 'Riset', deskripsi: 'Sesi eksperimen mandiri pembuatan bio-detergen ramah lingkungan berbasis limbah', tanggal: '2026-04-29', penyelenggara: 'Laboratorium IPA', status: 'tayang', jumlahFoto: 12, cover: cover('kimia') },
  { id: 4, judul: 'Pertandingan Final Turnamen Futsal & Basket', kategori: 'Olahraga', deskripsi: 'Semarak pertandingan puncak kejuaraan Harapan Cup edisi ke-12 yang diikuti seluruh angkatan', tanggal: '2026-04-25', penyelenggara: 'Pembina OSIS', status: 'tayang', jumlahFoto: 30, cover: cover('basket') },
  { id: 5, judul: 'Karnaval Budaya Nusantara & Pagelaran Tari Tradisional', kategori: 'Seni Budaya', deskripsi: 'Peringatan Hari Pendidikan Nasional melalui peragaan busana adat 38 provinsi', tanggal: '2026-04-18', penyelenggara: 'Ekskul Tari', status: 'tayang', jumlahFoto: 16, cover: cover('tari') },
  { id: 6, judul: 'Pelatihan Robotika Otomasi Industri dan IoT Terpadu', kategori: 'Teknologi & Riset', deskripsi: 'Workshop kolaboratif bersama Institut Teknologi mengimplementasikan sensor', tanggal: '2026-04-02', penyelenggara: 'Klub Robotika', status: 'tayang', jumlahFoto: 15, cover: cover('robotika') },
  { id: 7, judul: 'Upacara Peringatan Hari Kemerdekaan', kategori: 'Prestasi', deskripsi: 'Rangkaian upacara bendera dan lomba antarkelas dalam rangka 17 Agustus', tanggal: '2026-03-17', penyelenggara: 'OSIS', status: 'tayang', jumlahFoto: 22, cover: cover('upacara') },
  { id: 8, judul: 'Kunjungan Edukasi ke Museum Nasional', kategori: 'Riset', deskripsi: 'Kegiatan belajar luar kelas siswa kelas XI jurusan IPS', tanggal: '2026-03-05', penyelenggara: 'Wakasek Kurikulum', status: 'draft', jumlahFoto: 9, cover: cover('museum') },
  { id: 9, judul: 'Bersih-Bersih Sungai & Tanam Mangrove', kategori: 'Adiwiyata', deskripsi: 'Aksi peduli lingkungan bersama komunitas warga sekitar sekolah', tanggal: '2026-02-21', penyelenggara: 'Tim Adiwiyata', status: 'tayang', jumlahFoto: 27, cover: cover('mangrove') },
  { id: 10, judul: 'Lomba Cerdas Cermat Antarkelas', kategori: 'Prestasi', deskripsi: 'Babak final lomba cerdas cermat empat mata pelajaran', tanggal: '2026-02-10', penyelenggara: 'Humas Sekolah', status: 'tayang', jumlahFoto: 14, cover: cover('cerdas-cermat') },
  { id: 11, judul: 'Latihan Drumband & Persiapan Karnaval', kategori: 'Seni Budaya', deskripsi: 'Dokumentasi latihan rutin ekstrakurikuler drumband sebelum karnaval', tanggal: '2026-01-28', penyelenggara: 'Ekskul Drumband', status: 'draft', jumlahFoto: 8, cover: '' },
  { id: 12, judul: 'Pekan Olahraga Siswa Baru', kategori: 'Olahraga', deskripsi: 'Pengenalan cabang olahraga untuk peserta didik baru tahun ajaran ini', tanggal: '2026-01-12', penyelenggara: 'Pembina OSIS', status: 'tayang', jumlahFoto: 19, cover: cover('porsi') },
]
