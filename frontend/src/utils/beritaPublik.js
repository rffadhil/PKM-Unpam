import { kategoriBerita } from '@/config/kategoriBerita'
import { KATEGORI_PENGUMUMAN, MAKS_PENGUMUMAN_SIDEBAR } from '@/config/beritaPublik'
import { teksDariHtml } from '@/utils/html'

const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]
const KATA_PER_MENIT = 180

// '2026-02-24' → '24 Februari 2026'
export function formatTanggalLengkap(iso) {
  const [t, b, h] = iso.split('-').map(Number)
  return `${h} ${BULAN[b - 1]} ${t}`
}

// Terima '2026-02-24' atau timestamp ('2026-02-23T17:00:00.000Z') → 'YYYY-MM-DD' (zona waktu lokal).
export function normalisasiTanggal(nilai) {
  if (!nilai) return ''
  const teks = String(nilai)
  if (/^\d{4}-\d{2}-\d{2}$/.test(teks)) return teks
  const d = new Date(teks)
  if (Number.isNaN(d.getTime())) return ''
  const bln = String(d.getMonth() + 1).padStart(2, '0')
  const tgl = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${bln}-${tgl}`
}

// Perkiraan waktu baca (minimal 1 menit) dari HTML isi artikel.
export function hitungMenitBaca(html) {
  const kata = teksDariHtml(html || '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(kata / KATA_PER_MENIT))
}

function inisialDari(nama) {
  const kata = nama.replace(/[^\p{L}\s]/gu, ' ').split(/\s+/).filter(Boolean)
  if (kata.length === 0) return '?'
  return (kata.length === 1 ? kata[0].slice(0, 2) : kata[0][0] + kata[1][0]).toUpperCase()
}

// Satu baris respons /api/posts → bentuk yang dipakai tampilan publik.
// Toleran terhadap variasi nama field (gambar / gambarCover / gambar_cover, tanggal / created_at, dst.).
export function petakanBerita(baris) {
  const penulisMentah = baris.penulis
  const namaPenulis =
    (typeof penulisMentah === 'string' ? penulisMentah : penulisMentah?.nama) || 'Redaksi Sekolah'
  const konten = baris.konten || baris.isi || ''
  return {
    id: baris.id,
    slug: baris.slug || String(baris.id),
    judul: baris.judul || '',
    ringkasan: baris.ringkasan || baris.cuplikan || '',
    kategori: baris.kategori || '',
    gambar: baris.gambar || baris.gambarCover || baris.gambar_cover || '',
    tanggal: normalisasiTanggal(baris.tanggal || baris.created_at),
    menitBaca: hitungMenitBaca(konten || baris.ringkasan),
    disematkan: Boolean(baris.disematkan ?? baris.is_pinned),
    penulis: {
      nama: namaPenulis,
      inisial: (typeof penulisMentah === 'object' && penulisMentah?.inisial) || inisialDari(namaPenulis),
    },
  }
}

const terbaruDulu = (a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id

// Saring (kategori + kata kunci) lalu urutkan. `urut`: 'terbaru' | 'terlama'.
export function olahDaftar(daftar, { kategori = '', kataKunci = '', urut = 'terbaru' } = {}) {
  const kunci = kataKunci.trim().toLocaleLowerCase('id')
  const hasil = daftar
    .filter((a) => !kategori || a.kategori === kategori)
    .filter(
      (a) =>
        !kunci ||
        [a.judul, a.ringkasan, a.kategori, a.penulis.nama].some((t) => t.toLocaleLowerCase('id').includes(kunci)),
    )
    .sort(terbaruDulu)
  return urut === 'terlama' ? hasil.reverse() : hasil
}

// Daftar kategori untuk tombol filter: urutan dari konfigurasi CMS, lalu kategori lain yang ada di data.
export function hitungKategori(daftar) {
  const jumlah = new Map()
  daftar.forEach((a) => a.kategori && jumlah.set(a.kategori, (jumlah.get(a.kategori) ?? 0) + 1))
  const urutan = kategoriBerita.map((k) => k.nama)
  const lainnya = [...jumlah.keys()].filter((k) => !urutan.includes(k)).sort()
  return [...urutan, ...lainnya].map((nama) => ({ nama, jumlah: jumlah.get(nama) ?? 0 }))
}

// Headline utama: artikel terbaru yang bukan pengumuman.
export function pilihHeadline(daftar) {
  return [...daftar].sort(terbaruDulu).find((a) => a.kategori !== KATEGORI_PENGUMUMAN) ?? null
}

// Pengumuman untuk sidebar: yang disematkan dulu, lalu yang terbaru.
export function pilihPengumuman(daftar, maks = MAKS_PENGUMUMAN_SIDEBAR) {
  return daftar
    .filter((a) => a.kategori === KATEGORI_PENGUMUMAN)
    .sort((a, b) => Number(b.disematkan) - Number(a.disematkan) || terbaruDulu(a, b))
    .slice(0, maks)
}

// Warna label kategori di kartu (kelas lengkap agar terdeteksi Tailwind).
export function kelasChipKategori(kategori) {
  if (kategori === KATEGORI_PENGUMUMAN) return 'bg-cta-gold text-primary'
  if (/sosial/i.test(kategori)) return 'bg-secondary-fixed text-on-secondary-fixed'
  return 'bg-primary-container text-white'
}
