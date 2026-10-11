// Data dummy Profil & Staf.
// CATATAN BACKEND: tabel `staf` saat ini hanya punya nama, jabatan, mata_pelajaran, foto_url, urutan.
// Desain butuh juga: NIP/NUPTK, rumpun, pendidikan terakhir + institusi, status kepegawaian + golongan,
// sertifikasi PPG, dan flag tampil publik. Sambutan & visi cocok disimpan di `pengaturan_sekolah` (key/value).
const inti = [
  { nama: 'Drs. H. Bambang Sudirman, M.Pd', nomorInduk: '196808121994031004', rumpun: 'Pimpinan Sekolah', jabatan: 'Kepala Sekolah', bidang: 'Penanggung Jawab Utama', lencana: 'kepala', pendidikan: 'S2 Manajemen Pendidikan', institusi: 'Universitas Negeri Jakarta (UNJ)', statusKepegawaian: 'PNS', golongan: 'Pembina Utama' },
  { nama: 'Dra. Hj. Siti Nurjanah, M.Si', nomorInduk: '197204151998022001', rumpun: 'Pimpinan Sekolah', jabatan: 'Wakasek Kurikulum', bidang: 'MIPA - Kimia Organik', lencana: 'waka', pendidikan: 'S2 Kimia Sains', institusi: 'Institut Teknologi Bandung (ITB)', statusKepegawaian: 'PNS', golongan: 'Pembina' },
  { nama: 'Ahmad Fauzi, S.Pd., M.Ed', nomorInduk: '198003102005011008', rumpun: 'Pimpinan Sekolah', jabatan: 'Wakasek Kesiswaan', bidang: 'MIPA - Fisika Terapan', lencana: 'waka', pendidikan: 'Master of Education', institusi: 'Monash University (Australia)', statusKepegawaian: 'PNS', golongan: 'Penata Tk. I' },
  { nama: 'Endah Puspitasari, S.Si., M.Pd', nomorInduk: '4521763665210082', rumpun: 'Pembina Ekstrakurikuler', jabatan: 'Pembina Adiwiyata', bidang: 'Biologi & Ekologi Lingkungan', lencana: 'pembina', pendidikan: 'S2 Pendidikan Biologi', institusi: 'Universitas Indonesia (UI)', statusKepegawaian: 'PPPK', golongan: 'Fungsional' },
  { nama: 'Hendro Wicaksono, M.Sc', nomorInduk: '8943761663130091', rumpun: 'Pembina Ekstrakurikuler', jabatan: 'Pembina Robotik', bidang: 'Fisika & Komputasi Sains', lencana: 'ekskul', pendidikan: 'S2 Applied Physics', institusi: 'Institut Teknologi Bandung (ITB)', statusKepegawaian: 'GTY', golongan: '' },
].map((p, i) => ({ ...p, id: i + 1, urutan: i + 1, foto: null, sertifikasiPpg: true, tampilPublik: true }))

const depan = ['Budi', 'Dewi', 'Rudi', 'Rina', 'Hendra', 'Maya', 'Agus', 'Lestari', 'Eko', 'Putri', 'Dimas', 'Nur', 'Yoga', 'Fitri', 'Taufik', 'Wulan', 'Bayu', 'Citra']
const belakang = ['Santoso', 'Wijaya', 'Pratama', 'Hidayat', 'Saputra', 'Rahayu', 'Nugroho', 'Kusuma', 'Setiawan', 'Permana', 'Utami']
const gelar = ['S.Pd', 'M.Pd', 'S.Si', 'S.Kom', 'M.Si', 'S.Sn']
const mapel = ['Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'Fisika', 'Kimia', 'Biologi', 'Sejarah', 'Geografi', 'Ekonomi', 'Sosiologi', 'PJOK', 'Seni Budaya', 'Informatika', 'PPKn', 'Pendidikan Agama']
const kampus = ['Universitas Pendidikan Indonesia (UPI)', 'Universitas Negeri Jakarta (UNJ)', 'Universitas Gadjah Mada (UGM)', 'Universitas Indonesia (UI)', 'Institut Teknologi Bandung (ITB)']
const tuJabatan = [['Kepala Tata Usaha', 'Tata Usaha'], ['Laboran', 'Laboratorium IPA'], ['Pustakawan', 'Perpustakaan'], ['Staf IT', 'Teknologi Informasi'], ['Bendahara', 'Keuangan'], ['Staf Administrasi', 'Kesiswaan']]
const statusSiklus = ['PNS', 'PNS', 'PPPK', 'GTY', 'GTT']
const golonganPns = ['Pembina', 'Penata Tk. I', 'Penata Muda']

const nip = (i) => {
  const th = 1970 + (i % 25), bln = String((i % 12) + 1).padStart(2, '0'), tgl = String(((i * 7) % 28) + 1).padStart(2, '0')
  return `${th}${bln}${tgl}20${10 + (i % 12)}${bln}1${String(100 + i).slice(-3)}`
}
const nuptk = (i) => String(4521763665210000 + i * 8123)

// 59 guru + 14 tenaga kependidikan = 73, ditambah 5 di atas = 78 orang.
const tambahan = Array.from({ length: 73 }, (_, i) => {
  const tu = i >= 59
  const status = tu ? (i % 2 ? 'PPPK' : 'GTT') : statusSiklus[i % statusSiklus.length]
  const [jabTu, bidTu] = tuJabatan[i % tuJabatan.length]
  const m = mapel[i % mapel.length]
  return {
    id: i + 6,
    urutan: i + 6,
    nama: `${depan[i % depan.length]} ${belakang[(i * 3) % belakang.length]}, ${gelar[i % gelar.length]}`,
    nomorInduk: status === 'PNS' ? nip(i) : nuptk(i),
    rumpun: tu ? 'Tenaga Kependidikan' : 'Guru Mata Pelajaran',
    jabatan: tu ? jabTu : `Guru ${m}`,
    bidang: tu ? bidTu : m,
    lencana: tu ? 'tu' : 'guru',
    pendidikan: tu ? 'S1 Administrasi' : `S1 Pendidikan ${m}`,
    institusi: kampus[i % kampus.length],
    statusKepegawaian: status,
    golongan: status === 'PNS' ? golonganPns[i % 3] : status === 'PPPK' ? 'Fungsional' : '',
    foto: null,
    sertifikasiPpg: !tu && i % 6 !== 5,
    tampilPublik: i % 11 !== 10,
  }
})

export const staf = [...inti, ...tambahan]

export const ringkasanProfil = { akreditasi: 'Unggul (A)', lembagaAkreditasi: 'BAN-S/M (Terverifikasi)' }

export const sambutanAwal = {
  sambutan:
    'Selamat datang di gerbang digital SMA Harapan Jaya. Kami berkomitmen menyelenggarakan ekosistem pendidikan berwawasan lingkungan hijau Adiwiyata Mandiri, menumbuhkan integritas moral, serta mengantarkan generasi muda meraih prestasi unggul di kancah nasional maupun global.',
  visi: 'Terwujudnya Insan Berkarakter Unggul, Menguasai Sains & Teknologi Digital, Berdaya Saing Global, serta Berbudaya Lingkungan Hidup yang Lestari Berlandaskan Profil Pelajar Pancasila.',
  penulis: 'Drs. H. Bambang Sudirman, M.Pd',
  kurikulum: 'Kurikulum Merdeka Terintegrasi',
  status: 'live',
}
