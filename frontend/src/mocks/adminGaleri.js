// Data dummy Galeri.
// CATATAN BACKEND: tabel `galeri` di database saat ini per-FOTO (judul_foto, image_url, created_by).
// Desain butuh konsep ALBUM (judul, kategori, status tayang/draft, jumlah foto, sampul) dan
// kiriman kurasi dari siswa/guru -> perlu tabel `album` + kolom status/pengirim. Tanyakan ke tim backend.
const seed = [
  { judul: 'Panen Raya Hidroponik & Revitalisasi Biopori', deskripsi: 'Dokumentasi program aksi lingkungan hidup Adiwiyata Mandiri siswa kelas X & XI', kategori: 'Kegiatan Adiwiyata', lencana: 'ADIWIYATA', jumlahFoto: 18, tanggal: '2026-05-12', penyelenggara: 'Tim Adiwiyata' },
  { judul: 'Penganugerahan Juara Umum OSN & Festival Sains', deskripsi: 'Penyambutan delegasi tim olimpiade sains nasional bidang Fisika, Kimia, dan Biologi', kategori: 'Prestasi & Lomba', lencana: 'PRESTASI', jumlahFoto: 24, tanggal: '2026-05-08', penyelenggara: 'Humas Sekolah' },
  { judul: 'Praktikum Kimia Organik & Bioteknologi Terapan', deskripsi: 'Sesi eksperimen mandiri pembuatan bio-detergen ramah lingkungan berbasis limbah organik', kategori: 'Pembelajaran & Riset', lencana: 'RISET', jumlahFoto: 12, tanggal: '2026-04-29', penyelenggara: 'Laboratorium IPA' },
  { judul: 'Pertandingan Final Turnamen Futsal & Basket', deskripsi: 'Semarak pertandingan puncak kejuaraan Harapan Cup edisi ke-12 yang diikuti 24 tim', kategori: 'Prestasi & Lomba', lencana: 'OLAHRAGA', jumlahFoto: 30, tanggal: '2026-04-25', penyelenggara: 'Pembina OSIS' },
  { judul: 'Karnaval Budaya Nusantara & Pagelaran Seni', deskripsi: 'Peringatan Hari Pendidikan Nasional melalui peragaan busana adat 38 provinsi', kategori: 'Seni & Budaya', lencana: 'SENI BUDAYA', jumlahFoto: 16, tanggal: '2026-04-18', penyelenggara: 'Ekskul Tari' },
  { judul: 'Pelatihan Robotika Otomasi Industri dan IoT', deskripsi: 'Workshop kolaboratif bersama institut teknologi mengimplementasikan sensor otomatis', kategori: 'Pembelajaran & Riset', lencana: 'TEKNOLOGI & RISET', jumlahFoto: 15, tanggal: '2026-04-02', penyelenggara: 'Klub Robotika' },
  { judul: 'Jumat Bersih & Bank Sampah Sekolah', deskripsi: 'Gerakan pilah sampah dan penukaran poin bank sampah oleh seluruh kelas', kategori: 'Kegiatan Adiwiyata', lencana: 'ADIWIYATA', jumlahFoto: 10, tanggal: '2026-03-27', penyelenggara: 'Tim Adiwiyata' },
  { judul: 'Lomba Debat Bahasa Inggris Tingkat Kota', deskripsi: 'Tim debat sekolah meraih posisi runner-up pada babak final', kategori: 'Prestasi & Lomba', lencana: 'PRESTASI', jumlahFoto: 14, tanggal: '2026-03-14', penyelenggara: 'English Club' },
  { judul: 'Kunjungan Edukasi Museum Geologi', deskripsi: 'Pembelajaran lapangan tentang batuan, fosil, dan sejarah bumi', kategori: 'Pembelajaran & Riset', lencana: 'RISET', jumlahFoto: 20, tanggal: '2026-03-05', penyelenggara: 'Guru Geografi' },
  { judul: 'Pentas Seni Akhir Tahun', deskripsi: 'Penampilan musik, tari, dan teater dari seluruh ekstrakurikuler seni', kategori: 'Seni & Budaya', lencana: 'SENI BUDAYA', jumlahFoto: 28, tanggal: '2026-02-20', penyelenggara: 'Ekskul Teater' },
  { judul: 'Penanaman 500 Bibit Mangrove', deskripsi: 'Aksi konservasi pesisir bersama OSIS dan Pramuka', kategori: 'Kegiatan Adiwiyata', lencana: 'ADIWIYATA', jumlahFoto: 22, tanggal: '2026-02-11', penyelenggara: 'OSIS & Pramuka' },
  { judul: 'Olimpiade Matematika Antar Sekolah', deskripsi: 'Dokumentasi babak penyisihan dan final olimpiade tingkat provinsi', kategori: 'Prestasi & Lomba', lencana: 'PRESTASI', jumlahFoto: 9, tanggal: '2026-01-30', penyelenggara: 'Guru Matematika' },
]

const geser = (iso, hari) => {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - hari)
  return d.toISOString().slice(0, 10)
}

// Diperbanyak jadi 64 album supaya pagination terlihat. Hapus saat memakai API.
export const albumGaleri = Array.from({ length: 64 }, (_, i) => {
  const s = seed[i % seed.length]
  return {
    ...s,
    id: i + 1,
    cover: null, // isi dengan image_url dari API
    tanggal: geser(s.tanggal, Math.floor(i / seed.length) * 45),
    jumlahFoto: s.jumlahFoto + (i >= seed.length ? i % 5 : 0),
    status: i >= 6 && i % 9 === 8 ? 'draft' : 'tayang',
  }
})

export const kirimanKurasi = [
  { id: 101, judul: 'Aksi Bersih Pantai & Konservasi Bakau Teluk', kategori: 'Kegiatan Adiwiyata', kategoriDisarankan: 'Lingkungan Hidup / Adiwiyata', pengirim: 'Rian Aditya & Tim PMR', satuan: 'Kelas XI MIPA 2', jumlahFoto: 14, jenis: 'RAW+JPG', ukuranMB: 48.6, masuk: '2026-10-11T09:15:00' },
  { id: 102, judul: 'Latihan Gabungan Pasukan Pengibar Bendera (Paskibra)', kategori: 'Prestasi & Lomba', kategoriDisarankan: 'Ekstrakurikuler', pengirim: 'Drs. H. Mulyadi', satuan: 'Pembina Paskibra Sekolah', jumlahFoto: 22, jenis: 'HD', ukuranMB: 62.1, masuk: '2026-10-10T16:40:00' },
  { id: 103, judul: 'Kunjungan Edukasi Geologi Karst & Speleologi', kategori: 'Pembelajaran & Riset', kategoriDisarankan: 'Riset & Pembelajaran', pengirim: 'Siti Rahmah, S.Pd', satuan: 'Guru Geografi & Kebumian', jumlahFoto: 19, jenis: '', ukuranMB: 38.4, masuk: '2026-05-14T10:05:00' },
  { id: 104, judul: "Gladi Resik Teater Musikal 'Gita Nusantara'", kategori: 'Seni & Budaya', kategoriDisarankan: 'Seni & Budaya', pengirim: 'Nabila Syahrani', satuan: 'Ketua Ekskul Teater', jumlahFoto: 8, jenis: '', ukuranMB: 18.9, masuk: '2026-05-13T15:20:00' },
  { id: 105, judul: 'Dokumentasi Try Out CBT Masuk PTN Mandiri', kategori: 'Pembelajaran & Riset', kategoriDisarankan: 'Akademik', pengirim: 'Agung Prasetyo, M.T', satuan: 'Koordinator Kurikulum', jumlahFoto: 11, jenis: '', ukuranMB: 26.3, masuk: '2026-05-11T08:30:00' },
]

// Ringkasan dari server (kapasitas CDN). Nanti dari endpoint ringkasan galeri.
export const ringkasanGaleri = { storage: { terpakaiGB: 14.2, totalGB: 50 } }
