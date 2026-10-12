// Data dummy Pesan Masuk & Kontak (PTSP). Waktu dibuat RELATIF terhadap hari ini (WIB)
// supaya label "Hari ini" / "Kemarin" selalu benar saat demo.
// CATATAN BACKEND: `pesan_masuk` saat ini hanya punya nama, email, subjek, pesan, status, created_at.
// Desain butuh juga: nomor tiket, kategori layanan, WhatsApp, flag anonim (WBS), balasan,
// penugasan ke staf TU, dan status 3 tahap (belum / diproses / selesai). Konfigurasi kontak publik
// cocok disimpan di `pengaturan_sekolah` (key/value).
import { kunciTanggalWib } from '@/utils/pesan'

const p2 = (n) => String(n).padStart(2, '0')
const waktuWib = (hariLalu, jam, menit) => {
  const kunci = kunciTanggalWib(new Date(Date.now() - hariLalu * 86400000))
  return new Date(`${kunci}T${p2(jam)}:${p2(menit)}:00+07:00`).toISOString()
}

const inti = [
  { nomor: 'PTSP-2026-089', kategori: 'legalisir', pengirim: 'Bambang Hariyadi', satuan: 'Wali Murid', email: 'bambang.h@gmail.com', whatsapp: '0812-9981-2231', subjek: 'Permohonan Legalisir Ijazah 2023 Daring', isi: 'Selamat pagi TU SMA Harapan Jaya. Mohon bantuan info alur legalisir digital ijazah kelulusan tahun 2023. Berkas apa saja yang perlu dilampirkan via email ini? Terima kasih.', waktuMasuk: waktuWib(0, 10, 14), status: 'belum' },
  { nomor: 'PPDB-2026-042', kategori: 'ppdb', pengirim: 'Nurul Inayah', satuan: 'Calon Siswa', email: 'nurul.calonsiswa@yahoo.com', whatsapp: '0857-1122-3344', subjek: 'Konfirmasi upload sertifikat juara', isi: 'Sudah upload piagam juara taekwondo tingkat provinsi. Bagaimana ketentuan verifikasinya untuk jalur prestasi?', waktuMasuk: waktuWib(1, 16, 30), status: 'belum' },
  { nomor: 'WBS-2026-004', kategori: 'wbs', pengirim: 'Anonim Terproteksi', satuan: 'Kanal Enkripsi SHA-256', email: '', whatsapp: '', anonim: true, subjek: 'Laporan pengusulan pemilahan sampah', isi: 'Pengusulan pemilahan sampah organik dan anorganik di area kantin karena tempat sampah sering meluap.', waktuMasuk: waktuWib(1, 14, 15), status: 'diproses' },
  { nomor: 'HMS-2026-019', kategori: 'humas', pengirim: 'Rian Aditya', satuan: 'Humas Media Mitra Edukasi', email: 'rian@mitraedukasi.id', whatsapp: '0813-5566-7788', subjek: 'Permohonan peliputan Adiwiyata Fest', isi: 'Rencana peliputan kegiatan Adiwiyata Fest oleh tim media kami pada awal bulan depan.', waktuMasuk: waktuWib(3, 9, 10), status: 'selesai' },
  { nomor: 'PTSP-2026-087', kategori: 'akademik', pengirim: 'Siti Rahmah, S.Pd', satuan: 'Wali Murid Kelas X-3', email: 'siti.rahmah@gmail.com', whatsapp: '0821-3344-5566', subjek: 'Permintaan surat keterangan aktif', isi: 'Mohon diterbitkan surat keterangan aktif sebagai siswa untuk keperluan beasiswa putra kami.', waktuMasuk: waktuWib(4, 11, 5), status: 'selesai' },
].map((t, i) => ({ anonim: false, ...t, id: i + 1, dibaca: t.status === 'selesai' || i === 0, balasan: null, ditugaskanKe: '' }))

const depan = ['Agus', 'Dewi', 'Rudi', 'Rina', 'Hendra', 'Maya', 'Eko', 'Putri', 'Dimas', 'Nur', 'Yoga', 'Fitri', 'Taufik', 'Wulan']
const belakang = ['Santoso', 'Wijaya', 'Pratama', 'Hidayat', 'Saputra', 'Rahayu', 'Nugroho', 'Kusuma']
const bahan = {
  legalisir: [['Legalisir transkrip nilai', 'Mohon info prosedur legalisir transkrip nilai untuk keperluan melamar kerja.'], ['Permohonan duplikat ijazah', 'Ijazah asli hilang, mohon info prosedur penerbitan surat keterangan pengganti.']],
  ppdb: [['Pertanyaan syarat zonasi', 'Mohon penjelasan batas wilayah zonasi untuk jalur domisili PPDB.'], ['Perubahan data pendaftaran', 'Terdapat kesalahan penulisan nama pada formulir, bagaimana cara memperbaikinya?']],
  akademik: [['Permintaan surat pindah', 'Mohon informasi syarat mutasi siswa ke sekolah lain pada semester ini.'], ['Jadwal pengambilan rapor', 'Kapan jadwal pengambilan rapor kelas XI dan bisakah diwakilkan?']],
  humas: [['Tawaran kerja sama CSR', 'Perusahaan kami berminat bermitra dalam program lingkungan sekolah.'], ['Permohonan wawancara kepala sekolah', 'Mohon jadwal wawancara terkait program Adiwiyata Mandiri.']],
  wbs: [['Laporan fasilitas rusak', 'Beberapa keran di toilet lantai 2 rusak dan belum diperbaiki.'], ['Aspirasi kegiatan ekstrakurikuler', 'Mengusulkan penambahan kegiatan literasi digital setiap pekan.'], ['Laporan ketertiban parkir', 'Area parkir siswa sering penuh dan menghambat kendaraan antar-jemput.']],
}
const satuan = { legalisir: 'Alumni', ppdb: 'Calon Siswa', akademik: 'Wali Murid', humas: 'Mitra Media' }
const nonWbs = ['legalisir', 'ppdb', 'akademik', 'humas']
const prefix = { legalisir: 'PTSP', akademik: 'PTSP', ppdb: 'PPDB', wbs: 'WBS', humas: 'HMS' }

// 123 tiket tambahan -> total 128: belum 3, diproses 4, selesai 121, WBS 4 (sesuai desain).
const tambahan = Array.from({ length: 123 }, (_, i) => {
  const kategori = i >= 1 && i <= 3 ? 'wbs' : nonWbs[i % 4]
  const [subjek, isi] = bahan[kategori][i % bahan[kategori].length]
  const anonim = kategori === 'wbs'
  const nama = `${depan[i % depan.length]} ${belakang[(i * 3) % belakang.length]}`
  const waktuMasuk = waktuWib(5 + Math.floor(i / 2), 8 + ((i * 7) % 9), (i * 13) % 60)
  return {
    id: i + 6,
    nomor: `${prefix[kategori]}-${kunciTanggalWib(new Date(waktuMasuk)).slice(0, 4)}-${String(100 + i)}`,
    kategori,
    pengirim: anonim ? 'Anonim Terproteksi' : nama,
    satuan: anonim ? 'Kanal Enkripsi SHA-256' : satuan[kategori],
    email: anonim ? '' : `${nama.split(' ')[0].toLowerCase()}${i}@mail.id`,
    whatsapp: anonim ? '' : `0812-${1000 + i}-${2000 + i}`,
    anonim,
    subjek,
    isi,
    waktuMasuk,
    status: i === 0 ? 'belum' : i <= 3 ? 'diproses' : 'selesai',
    dibaca: i > 3,
    balasan: null,
    ditugaskanKe: '',
  }
})

export const tiketPesan = [...inti, ...tambahan]

export const petugasTu = [
  'Dewi Lestari, S.Pd (TU Akademik)',
  'Ahmad Fauzi, M.Kom. (Teknologi Informasi)',
  'Rudi Hartono, S.Pd. (Kesiswaan)',
  'Siti Rahmawati, S.Pd. (Humas)',
]

export const sinkronTerakhir = '10:15 WIB'

export const kontakPublikAwal = {
  whatsappPosko: '+62 811-3456-7890 (Aktif 24 Jam)',
  teleponTu: '(021) 7890-1234 / Ext. 102',
  jamSenKam: '07.30 - 15.30 WIB (Istirahat 12.00 - 13.00)',
  jamJumat: '07.30 - 11.30 WIB',
  alamat: 'Jl. Pendidikan Raya No. 45, Kebayoran Baru, Jakarta Selatan',
  petaUrl: 'https://maps.google.com/?cid=1234567890',
}
