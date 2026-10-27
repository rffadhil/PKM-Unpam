import { BATAS_BERKAS_MB, FORMAT_DOKUMEN } from '@/config/dokumenAdmin'

// 430080 -> "420 KB", 2516582 -> "2.4 MB"
export function formatUkuran(bytes = 0) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ISO -> "14 Feb 2026, 09:20 WIB"
export function formatWaktuUnggah(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  const bagian = Object.fromEntries(
    new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    })
      .formatToParts(d)
      .map((p) => [p.type, p.value]),
  )
  return `${bagian.day} ${bagian.month} ${bagian.year}, ${bagian.hour}:${bagian.minute} WIB`
}

export function ekstensiBerkas(file) {
  return (file.name.split('.').pop() ?? '').toLowerCase()
}

// "Formulir Daftar Ulang.pdf" -> "Formulir Daftar Ulang"
export function judulDariBerkas(nama = '') {
  return nama.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim()
}

// Mengembalikan pesan error, atau '' kalau berkas valid.
export function validasiBerkas(file) {
  if (!FORMAT_DOKUMEN[ekstensiBerkas(file)]) return 'Format tidak didukung. Gunakan PDF, DOCX, atau XLSX.'
  if (file.size === 0) return 'Berkas kosong.'
  if (file.size > BATAS_BERKAS_MB * 1024 * 1024) return `Ukuran berkas maksimal ${BATAS_BERKAS_MB} MB.`
  return ''
}

export function validasiDokumen({ judul }) {
  const e = {}
  if (!judul.trim()) e.judul = 'Judul dokumen wajib diisi.'
  else if (judul.trim().length > 150) e.judul = 'Judul maksimal 150 karakter.'
  return e
}

// "Rev 2.1" -> "Rev 2.2"; format lain -> "Rev 1.0"
export function naikkanVersi(versi = '') {
  const cocok = versi.match(/Rev\s*(\d+)\.(\d+)/i)
  return cocok ? `Rev ${cocok[1]}.${Number(cocok[2]) + 1}` : 'Rev 1.0'
}

export function saringDokumen(data, { kata = '', kategori = '', status = '' } = {}) {
  const k = kata.trim().toLowerCase()
  return data.filter((d) => {
    if (kategori && d.kategori !== kategori) return false
    if (status && (d.aktif ? 'aktif' : 'nonaktif') !== status) return false
    if (!k) return true
    return [d.nama, d.deskripsi, d.tipe, d.kategori, d.pengunggah].some((t) => (t ?? '').toLowerCase().includes(k))
  })
}

// Terbaru di atas.
export function urutkanDokumen(data) {
  return [...data].sort((a, b) => new Date(b.diunggah) - new Date(a.diunggah))
}
