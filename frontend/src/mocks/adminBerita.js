// Gambar placeholder dari hasil export Stitch (bisa kedaluwarsa) — ganti dengan upload Cloudinary.
const THUMB = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBYtpfvisDtHWrcBaojEn4U8ecJa83zIG0sD_OCfpbIkyscQ2fCiAzu5XbC1xbacOYqPc8wCaqHGTodOBkOfq04eXJebSevRBsmFKqGV2BT_WA8kBbZgHmIDDjI3crAA5QeLc4mSym6UHV6BP52WHejCamCLGLQyfPwE4VVpldN1XPVEM0AFH8Kkig3PR-xLR9llxRPtihTQfh_OqdjFHFZr4mhv9k3UMbgyq2bMKQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBAinbmysrOcaf-yRM4BsoDNSONvEA99r2IUaQNJwMQmd7ifOGA7hjwtHPqmK2qtDFw3B814eI9Oj3EffY0cnyRUVP6bIinQVGlFvkEkz50Sl_kOGf65iYFGDDQGEBb29p_UDJEzuoTreY9_X2bANLZ-jWyPVKgKZB-zm9FNNxHd1LZpB_9myC4oF6HcZ_Gu4b39quM1qsgbaI-2bRCWpJiLmbxURL7ZIzXjzsiOzc',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBOf377iDPGmAbyh7QmYhLO7t0E0HR0m5FhlFWlt6ZgE9H9YiWszuHDWSoDQ7uIWbT5eDIsQfi_gHyG9aHPA35YGajobYh4VJ3THgj0s8k_RxlC1c_J-NNZnKkL83l--aKPH4xKEEe3CI4wS72m82Rk1GHnjqQyEtlzAcT_RrfBvbFoOyN66gr1y-NAvLHKPWebdshox-Q5zBQ2IyF9qQGlt5HhldnIboVLjRFr3aE',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA-W91SY9KzMRLF4AwRvcl0d0w8R-CoknUgE-BaDp0lXr-mhh5smGC-JuMA-4TfO2RUkTgz5CUNJuCcObMWfW7HUwzetTcu-0oJ5CEwFIyof5QD8u1FGN4lV5MdlqwisOazbgv_RLhRBFF_GTtxPGW_6ZLkkjomOyYb09zvGiWJPe4EUsWvlEca8344EcDtLyMStPZVr6TY-u4Q1e0f8pnaNvpGDZwj66lpNrEeFKk',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDyTHhwiinAaHH5GPWc4g-221KEzL-CMXx4aUoNoClnTw5-yTA8qVHh2gdDSwuonwZQU0Is_wlvN-dhwAoEcp19bEBI7puwjU9ciqiPkMslw9L1PLIDmQKS-7Zhd024wdEpxvYcTBgMIK--FCsHamngRCzkPwxOlD5r_s1F46ahDk_JjmQCMFkUQuzFV05lkl6E0BHlS2KRZDuTqxRYef6T2QYrX2ErU6qixtQOPXk',
]

// DATA DUMMY halaman admin Berita & Pengumuman.
// Bentuk mengikuti tabel posts + join users (penulis). Ganti dengan respons API.
// Kolom yang dibutuhkan UI tetapi BELUM ada di ERD: status (draf/terbit), cuplikan (bisa
// diturunkan dari konten), published_at, deleted_at (soft delete).

const dasar = [
  {
    id: 1,
    slug: 'tim-robotik-juara-wro-2026-tokyo',
    judul: 'Tim Robotik SMA Harapan Jaya Sabet Medali Emas WRO 2026 di Tokyo',
    ringkasan:
      'Prestasi gemilang diraih tim robotik tingkat internasional di Tokyo Big Sight dengan prototipe otomatisasi agrikultur cerdas...',
    kategori: 'Prestasi Siswa',
    penulis: { nama: 'Humas & Kesiswaan', email: 'humas@smaharapanjaya.sch.id', inisial: 'HK', tone: 'netral' },
    tanggal: '2026-02-24',
    status: 'terbit',
    gambar: THUMB[0],
  },
  {
    id: 2,
    slug: 'hari-bumi-program-1-siswa-1-pohon',
    judul: 'Peringatan Hari Bumi: Peluncuran Program 1 Siswa 1 Pohon',
    ringkasan:
      'Memperkuat komitmen sebagai Sekolah Adiwiyata Mandiri, seluruh peserta didik menanam bibit endemik di area konservasi sekolah...',
    kategori: 'Adiwiyata & Lingkungan',
    penulis: { nama: 'Tim Adiwiyata', email: 'adiwiyata@smaharapanjaya.sch.id', inisial: 'TA', tone: 'hijau' },
    tanggal: '2026-02-22',
    status: 'terbit',
    gambar: THUMB[1],
  },
  {
    id: 3,
    slug: 'verifikasi-berkas-ppdb-jalur-prestasi-2026-2027',
    judul: 'Verifikasi Berkas Calon Peserta Didik Baru (PPDB) Jalur Prestasi 2026/2027',
    ringkasan:
      'Pengumuman resmi tata cara, jadwal, dan checklist berkas fisik sertifikat prestasi bagi calon peserta didik baru...',
    kategori: 'Pengumuman Resmi',
    penulis: { nama: 'Panitia PPDB', email: 'ppdb@smaharapanjaya.sch.id', inisial: 'PP', tone: 'kuning' },
    tanggal: '2026-02-20',
    status: 'terbit',
    gambar: THUMB[2],
  },
  {
    id: 4,
    slug: 'sosialisasi-abm-dan-strategi-snbp-kelas-xii',
    judul: 'Sosialisasi Asesmen Bakat Minat (ABM) dan Strategi SNBP Kelas XII',
    ringkasan:
      'Panduan pemilihan program studi PTN bagi siswa kelas akhir berdasarkan hasil pemetaan bakat dan minat...',
    kategori: 'Akademik',
    penulis: { nama: 'Guru BK', email: 'bk@smaharapanjaya.sch.id', inisial: 'BK', tone: 'biru' },
    tanggal: '2026-02-18',
    status: 'draf',
    gambar: THUMB[3],
  },
  {
    id: 5,
    slug: 'jadwal-gladi-bersih-anbk-2026',
    judul: 'Jadwal Gladi Bersih Asesmen Nasional Berbasis Komputer (ANBK) 2026',
    ringkasan:
      'Pembagian sesi dan tata tertib teknis pelaksanaan simulasi gladi bersih bagi peserta ANBK...',
    kategori: 'Pengumuman Resmi',
    penulis: { nama: 'Wakasek Kurikulum', email: 'kurikulum@smaharapanjaya.sch.id', inisial: 'WK', tone: 'abu' },
    tanggal: '2026-02-15',
    status: 'terbit',
    gambar: THUMB[4],
  },
]

// Total 48 artikel (42 terbit, 6 draf) seperti di desain: 5 baris asli + 43 baris tiruan
// supaya paginasi, filter, dan pencarian bisa dicoba. Hapus saat memakai API.
const DRAF_TIRUAN = new Set([12, 19, 27, 33, 41])

function geserHari(iso, hari) {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + hari)
  const bln = String(d.getMonth() + 1).padStart(2, '0')
  const tgl = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${bln}-${tgl}`
}

export function buatDaftarBerita() {
  const hasil = [...dasar]
  for (let i = 6; i <= 48; i += 1) {
    const b = dasar[(i - 1) % dasar.length]
    hasil.push({
      ...b,
      id: i,
      slug: `${b.slug}-${i}`,
      tanggal: geserHari('2026-02-15', -(i - 5) * 3),
      status: DRAF_TIRUAN.has(i) ? 'draf' : 'terbit',
    })
  }
  return hasil
}

// Angka pembaca bulan ini (dari analitik; dummy).
export const pembacaBulanIni = '14.820'
