import { BATAS_ASET_MB } from '@/config/pengaturanAdmin'

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Sementara: tebak dari teks peran di mock ("Super Admin").
// TODO: ganti dengan peran dari sesi login (JWT) saat modul auth selesai.
export function adalahSuperAdmin(peran = '') {
  return /super/i.test(peran)
}

// "Drs. Arya Gagah, S.Kom" -> "AG" (gelar dilewati)
export function inisialAdmin(nama = '') {
  const kata = nama.split(/\s+/).filter((k) => k && !/[.,]$/.test(k))
  const sumber = kata.length ? kata : nama.split(/\s+/)
  return sumber.slice(0, 2).map((k) => k[0]?.toUpperCase() ?? '').join('') || '?'
}

// "SMA Harapan Jaya" -> "HJ" (dua kata terakhir)
export function inisialInstitusi(nama = '') {
  const kata = nama.trim().split(/\s+/).filter(Boolean)
  return kata.slice(-2).map((k) => k[0].toUpperCase()).join('') || '?'
}

// Apakah dua objek datar sama isinya.
export function samaIsi(a, b) {
  return Object.keys(a).every((k) => a[k] === b[k])
}

export function validasiPengaturan(f) {
  const e = {}
  if (!f.namaInstitusi.trim()) e.namaInstitusi = 'Nama institusi wajib diisi.'
  if (!/^\d{8}$/.test(f.npsn.trim())) e.npsn = 'NPSN terdiri dari 8 digit angka.'
  if (f.slogan.length > 120) e.slogan = 'Slogan maksimal 120 karakter.'
  if (!RE_EMAIL.test(f.email.trim())) e.email = 'Format email tidak valid.'
  if (!/\d{6,}/.test(f.telepon.replace(/\D/g, ''))) e.telepon = 'Nomor telepon/WhatsApp wajib diisi.'
  if (!/^\d{5}/.test(f.kodePos.trim())) e.kodePos = 'Kode pos diawali 5 digit angka.'
  if (!f.alamat.trim()) e.alamat = 'Alamat kampus wajib diisi.'
  return e
}

// Mengembalikan pesan error, atau '' kalau berkas valid.
export function validasiAset(file, formatBoleh) {
  const ekstensi = (file.name.split('.').pop() ?? '').toLowerCase()
  if (!formatBoleh.includes(ekstensi)) return `Format tidak didukung. Gunakan ${formatBoleh.join(', ').toUpperCase()}.`
  if (file.size > BATAS_ASET_MB * 1024 * 1024) return `Ukuran berkas maksimal ${BATAS_ASET_MB} MB.`
  return ''
}

export function validasiAdmin(f, { baru }) {
  const e = {}
  if (!f.nama.trim()) e.nama = 'Nama lengkap wajib diisi.'
  if (!f.nomor.trim()) e.nomor = `${f.tipeNomor} wajib diisi.`
  else if (!/^[\d\s]+$/.test(f.nomor.trim())) e.nomor = `${f.tipeNomor} hanya boleh berisi angka dan spasi.`
  if (!RE_EMAIL.test(f.email.trim())) e.email = 'Format email tidak valid.'
  if (baru) {
    const sandi = f.sandi ?? ''
    if (sandi.length < 8) e.sandi = 'Kata sandi sementara minimal 8 karakter.'
    else if (!/[A-Za-z]/.test(sandi) || !/\d/.test(sandi)) e.sandi = 'Gunakan kombinasi huruf dan angka.'
  }
  return e
}

// Akun baru selalu Sub Admin dan aktif (tidak dipilih lewat form). Foto opsional.
export function adminKosong() {
  return { id: null, nama: '', tipeNomor: 'NIP', nomor: '', email: '', role: 'subadmin', aktif: true, foto: '', sandi: '' }
}