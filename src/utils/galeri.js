// Fungsi murni modul Galeri (mudah dites).
const fmt = (o) => new Intl.DateTimeFormat('id-ID', { timeZone: 'UTC', ...o })

export const formatAngka = (n) => new Intl.NumberFormat('id-ID').format(n)
export const formatUkuran = (mb) => `${mb.toFixed(1)} MB`

// "2026-05-12" -> "12 Mei 2026"
export function formatTanggalSingkat(iso) {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`)
  return `${iso.slice(8, 10)} ${fmt({ month: 'short' }).format(d).replace('.', '')} ${iso.slice(0, 4)}`
}

// "Hari ini, 09:15" | "Kemarin, 16:40" | "14 Mei 2026"
export function formatMasuk(iso, now = new Date()) {
  const d = new Date(iso)
  const sama = (a, b) => a.toDateString() === b.toDateString()
  const kemarin = new Date(now)
  kemarin.setDate(now.getDate() - 1)
  const jam = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  if (sama(d, now)) return `Hari ini, ${jam}`
  if (sama(d, kemarin)) return `Kemarin, ${jam}`
  return formatTanggalSingkat(iso)
}

export function hitungKategori(albums, daftarKategori) {
  const hasil = Object.fromEntries(daftarKategori.map((k) => [k, 0]))
  albums.forEach((a) => {
    if (a.kategori in hasil) hasil[a.kategori] += 1
  })
  return hasil
}

export function saringAlbum(list, { kategori, status, kata }) {
  const k = (kata ?? '').trim().toLowerCase()
  return list.filter(
    (a) =>
      (!kategori || a.kategori === kategori) &&
      (!status || a.status === status) &&
      (!k || a.judul.toLowerCase().includes(k) || a.deskripsi.toLowerCase().includes(k)),
  )
}

export function urutkanAlbum(list, mode = 'terbaru') {
  const salin = [...list]
  const aturan = {
    terbaru: (a, b) => b.tanggal.localeCompare(a.tanggal),
    terlama: (a, b) => a.tanggal.localeCompare(b.tanggal),
    nama: (a, b) => a.judul.localeCompare(b.judul, 'id'),
    foto: (a, b) => b.jumlahFoto - a.jumlahFoto,
  }
  return salin.sort(aturan[mode] ?? aturan.terbaru)
}

// rentangHalaman dipindah ke utils/halaman.js (dipakai bersama modul lain)
export { rentangHalaman } from './halaman'
