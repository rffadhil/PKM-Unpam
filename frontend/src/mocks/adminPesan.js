// Data dummy tiket/pesan masuk. Waktu dibuat relatif terhadap hari ini supaya
// label "Hari ini" / "Kemarin" selalu muncul. Kolom ERD `pesan_masuk`: nama, email, subjek,
// pesan, status, created_at. Kolom tambahan yang perlu diusulkan ke backend: kategori, telepon,
// instansi, anonim, dibaca, catatan.
// TODO: ganti dengan GET /api/pesan.
const waktu = (selisihHari, jam, menit) => {
  const n = new Date()
  return new Date(n.getFullYear(), n.getMonth(), n.getDate() - selisihHari, jam, menit).toISOString()
}

export const mockTiket = [
  { id: 1, nama: 'Bambang Hariyadi', email: 'bambang.h@gmail.com', telepon: '0812-9981-2231', instansi: '', anonim: false, kategori: 'tu-legalisir', subjek: 'Permohonan', pesan: 'Mohon info prosedur legalisir ijazah dan SKHUN untuk keperluan melamar kerja. Apakah bisa diwakilkan dan berapa lama prosesnya?', status: 'baru', dibaca: false, diterima: waktu(0, 10, 14), catatan: '' },
  { id: 2, nama: 'Nurul Inayah', email: 'nurul.calonsiswa@yahoo.com', telepon: '0857-1122-3344', instansi: '', anonim: false, kategori: 'ppdb', subjek: 'Konfirmasi', pesan: 'Sudah upload piagam Juara 2 olimpiade sains tingkat provinsi untuk jalur prestasi. Mohon dikonfirmasi apakah berkasnya sudah diterima dan lengkap.', status: 'baru', dibaca: true, diterima: waktu(1, 16, 30), catatan: '' },
  { id: 3, nama: 'Anonim Terproteksi', email: '', telepon: '', instansi: '', anonim: true, kategori: 'wbs', subjek: 'Laporan', pesan: 'Pengusulan pemilahan sampah di area kantin belum berjalan dan banyak siswa membuang sampah sembarangan. Mohon ditindaklanjuti oleh pihak sekolah.', status: 'diproses', dibaca: true, diterima: waktu(1, 14, 15), catatan: 'Diteruskan ke Tim Adiwiyata.' },
  { id: 4, nama: 'Rian Aditya', email: 'rian@mediaedukasi.id', telepon: '', instansi: 'Humas Media Mitra Edukasi', anonim: false, kategori: 'humas', subjek: 'Permohonan', pesan: 'Rencana peliputan kegiatan Panen Raya Hidroponik untuk rubrik pendidikan. Kami mohon izin liputan dan kontak narasumber.', status: 'baru', dibaca: true, diterima: waktu(5, 9, 10), catatan: '' },
  { id: 5, nama: 'Siti Rahmah, S.Pd', email: 'siti.rahmah@gmail.com', telepon: '0813-4455-6677', instansi: 'Wali Murid Kelas X-3', anonim: false, kategori: 'tu-akademik', subjek: 'Permintaan', pesan: 'Surat telah diterbitkan dan mohon dikirimkan salinannya ke email. Terima kasih atas bantuannya.', status: 'selesai', dibaca: true, diterima: waktu(6, 11, 5), catatan: 'Salinan sudah dikirim.' },
  { id: 6, nama: 'Hendra Kusuma', email: 'hendra.k@gmail.com', telepon: '0821-7788-9900', instansi: 'Orang tua calon siswa', anonim: false, kategori: 'ppdb', subjek: 'Pertanyaan', pesan: 'Apakah jalur zonasi menerima kartu keluarga yang diterbitkan kurang dari satu tahun? Mohon penjelasannya.', status: 'diproses', dibaca: true, diterima: waktu(7, 15, 20), catatan: '' },
  { id: 7, nama: 'Dewi Lestari', email: 'dewi.l@outlook.com', telepon: '0856-3344-5566', instansi: 'Alumni 2019', anonim: false, kategori: 'tu-legalisir', subjek: 'Permohonan', pesan: 'Saya alumni angkatan 2019 dan kehilangan ijazah asli. Bagaimana prosedur surat keterangan pengganti ijazah?', status: 'baru', dibaca: true, diterima: waktu(8, 8, 45), catatan: '' },
  { id: 8, nama: 'Anonim Terproteksi', email: '', telepon: '', instansi: '', anonim: true, kategori: 'wbs', subjek: 'Aduan', pesan: 'Terdapat pungutan tidak resmi pada kegiatan study tour. Mohon dilakukan klarifikasi kepada panitia.', status: 'baru', dibaca: true, diterima: waktu(9, 19, 2), catatan: '' },
  { id: 9, nama: 'PT Cipta Mandiri', email: 'csr@ciptamandiri.co.id', telepon: '021-5550-1122', instansi: 'Divisi CSR', anonim: false, kategori: 'humas', subjek: 'Kemitraan', pesan: 'Kami tertarik menjalin kemitraan program beasiswa dan pelatihan robotik. Mohon dijadwalkan pertemuan dengan pihak sekolah.', status: 'diproses', dibaca: true, diterima: waktu(10, 13, 30), catatan: 'Menunggu jadwal kepala sekolah.' },
  { id: 10, nama: 'Agus Salim', email: 'agus.salim@gmail.com', telepon: '0811-2200-3300', instansi: 'Wali Murid Kelas XI-2', anonim: false, kategori: 'tu-akademik', subjek: 'Permintaan', pesan: 'Mohon surat keterangan aktif bersekolah untuk keperluan pengajuan tunjangan keluarga.', status: 'selesai', dibaca: true, diterima: waktu(12, 10, 0), catatan: '' },
  { id: 11, nama: 'Putri Maharani', email: 'putri.m@gmail.com', telepon: '0878-1212-3434', instansi: 'Calon siswa', anonim: false, kategori: 'ppdb', subjek: 'Pertanyaan', pesan: 'Kapan jadwal tes wawancara jalur prestasi dan apa saja dokumen yang perlu dibawa?', status: 'selesai', dibaca: true, diterima: waktu(14, 9, 25), catatan: '' },
  { id: 12, nama: 'Yayasan Peduli Bumi', email: 'info@pedulibumi.org', telepon: '', instansi: 'Program Sekolah Hijau', anonim: false, kategori: 'humas', subjek: 'Undangan', pesan: 'Mengundang perwakilan Tim Adiwiyata sebagai pembicara pada Festival Sekolah Hijau bulan depan.', status: 'baru', dibaca: true, diterima: waktu(16, 14, 40), catatan: '' },
]

export const mockKontak = {
  whatsapp: '+62 811-3456-7890 (Aktif 24 Jam)',
  telepon: '(021) 7890-1234 / Ext. 102',
  jamSenKam: '07.30 - 15.30 WIB (Istirahat 12.00 - 13.00)',
  jamJumat: '07.30 - 11.30 WIB',
  alamat: 'Jl. Pendidikan Raya No. 45, Kebayoran Baru, Jakarta Selatan',
  peta: 'https://maps.google.com/?q=SMA+Harapan+Jaya',
}
