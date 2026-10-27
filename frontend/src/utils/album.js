import { BATAS_FOTO_MB, KATEGORI_ALBUM } from '@/config/galeriAdmin'

// "2026-05-12" -> "12 Mei 2026"
export function formatTanggalAlbum(iso) {
  if (!iso) return '-'
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return '-'
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(d)
}

export function saringAlbum(data, { kata = '' } = {}) {
  const k = kata.trim().toLowerCase()
  if (!k) return data
  return data.filter((a) =>
    [a.judul, a.deskripsi, a.kategori, a.penyelenggara].some((t) => (t ?? '').toLowerCase().includes(k)),
  )
}

// Terbaru di atas.
export function urutkanAlbum(data) {
  return [...data].sort((a, b) => b.tanggal.localeCompare(a.tanggal))
}

export function albumKosong() {
  return {
    id: null,
    judul: '',
    kategori: KATEGORI_ALBUM[0],
    deskripsi: '',
    tanggal: new Date().toISOString().slice(0, 10),
    penyelenggara: '',
    status: 'tayang',
    cover: '',
    jumlahFoto: 0,
  }
}

export function validasiAlbum(f) {
  const e = {}
  if (!f.judul.trim()) e.judul = 'Judul album wajib diisi.'
  else if (f.judul.trim().length > 120) e.judul = 'Judul maksimal 120 karakter.'
  if (!f.tanggal) e.tanggal = 'Tanggal kegiatan wajib diisi.'
  if (!f.penyelenggara.trim()) e.penyelenggara = 'Penyelenggara wajib diisi.'
  if (f.deskripsi.length > 300) e.deskripsi = 'Deskripsi maksimal 300 karakter.'
  return e
}

// Mengembalikan pesan error, atau '' kalau berkas valid.
export function validasiGambar(file) {
  if (!file.type.startsWith('image/')) return 'Berkas harus berupa gambar (JPG, PNG, atau WebP).'
  if (file.size > BATAS_FOTO_MB * 1024 * 1024) return `Ukuran gambar maksimal ${BATAS_FOTO_MB} MB.`
  return ''
}
