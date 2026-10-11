import { POLA_SLUG } from './slug'
import { teksDariHtml } from './html'

export const MAKS_UKURAN_GAMBAR = 5 * 1024 * 1024 // 5 MB (PRD)
export const TIPE_GAMBAR = ['image/jpeg', 'image/png', 'image/webp']

// Mengembalikan pesan kesalahan, atau '' bila file valid.
export function validasiGambar(file) {
  if (!TIPE_GAMBAR.includes(file.type)) return 'Format gambar harus JPG, PNG, atau WebP.'
  if (file.size > MAKS_UKURAN_GAMBAR) return 'Ukuran gambar maksimal 5 MB.'
  return ''
}

// Aturan ERD: posts.judul & slug wajib. Draf boleh belum lengkap; artikel terbit harus lengkap.
export function validasiBerita(n) {
  const galat = {}
  const judul = n.judul.trim()
  if (!judul) galat.judul = 'Judul wajib diisi.'
  else if (judul.length < 5) galat.judul = 'Judul minimal 5 karakter.'
  else if (judul.length > 150) galat.judul = 'Judul maksimal 150 karakter.'

  if (!n.slug) galat.slug = 'Slug wajib diisi.'
  else if (!POLA_SLUG.test(n.slug)) galat.slug = 'Slug hanya boleh huruf kecil, angka, dan tanda hubung.'

  if (n.ringkasan.length > 200) galat.ringkasan = 'Cuplikan maksimal 200 karakter.'
  if (!n.tanggal) galat.tanggal = 'Tanggal publikasi wajib diisi.'

  if (n.status === 'terbit') {
    if (!n.kategori) galat.kategori = 'Pilih kategori sebelum menerbitkan.'
    if (teksDariHtml(n.konten).length < 20) galat.konten = 'Isi artikel minimal 20 karakter sebelum diterbitkan.'
    if (!n.gambar) galat.gambar = 'Gambar cover wajib untuk artikel yang diterbitkan.'
  }
  return galat
}
