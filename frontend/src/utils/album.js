import { BATAS_FOTO_MB, KATEGORI_ALBUM } from '@/config/galeriAdmin'

// "2026-05-12" -> "12 Mei 2026"
export function formatTanggalAlbum(iso) {
  if (!iso) return '-'
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return '-'
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(d)
}

export function saringAlbum(data, { kata = '', kategori = '' } = {}) {
  const k = (kata || '').trim().toLowerCase()
  const kat = (kategori || '').trim().toLowerCase()

  if (!k && (!kat || kat === 'semua' || kat === 'semua album')) return data || []

  return (data || []).filter((a) => {
    if (!a) return false
    if (kat && kat !== 'semua' && kat !== 'semua album' && (a.kategori || '').toLowerCase() !== kat) {
      return false
    }
    if (k) {
      return [a.judul, a.deskripsi, a.kategori, a.penyelenggara].some((t) => (t ?? '').toLowerCase().includes(k))
    }
    return true
  })
}

// Terbaru di atas.
export function urutkanAlbum(data) {
  if (!Array.isArray(data)) return []
  return [...data].sort((a, b) => {
    const tA = String(a.tanggal || a.created_at || '')
    const tB = String(b.tanggal || b.created_at || '')
    return tB.localeCompare(tA)
  })
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
  const RE_TEKS_AMAN = /^[a-zA-Z0-9\s.,!?'"():;\/\-&]+$/
  const RE_PENYELENGGARA = /^[a-zA-Z0-9\s.,'/\-&()]+$/

  if (!f.judul?.trim()) e.judul = 'Judul album wajib diisi.'
  else if (f.judul.trim().length > 120) e.judul = 'Judul maksimal 120 karakter.'
  else if (!RE_TEKS_AMAN.test(f.judul.trim())) e.judul = 'Judul album tidak boleh mengandung karakter khusus.'

  if (!f.tanggal) e.tanggal = 'Tanggal kegiatan wajib diisi.'

  if (!f.penyelenggara?.trim()) e.penyelenggara = 'Penyelenggara wajib diisi.'
  else if (!RE_PENYELENGGARA.test(f.penyelenggara.trim())) e.penyelenggara = 'Penyelenggara tidak boleh mengandung karakter khusus.'

  if (f.deskripsi && f.deskripsi.length > 300) e.deskripsi = 'Deskripsi maksimal 300 karakter.'
  return e
}

// Mengembalikan pesan error, atau '' kalau berkas valid.
export function validasiGambar(file) {
  if (!file.type.startsWith('image/')) return 'Berkas harus berupa gambar (JPG, PNG, atau WebP).'
  if (file.size > BATAS_FOTO_MB * 1024 * 1024) return `Ukuran gambar maksimal ${BATAS_FOTO_MB} MB.`
  return ''
}
