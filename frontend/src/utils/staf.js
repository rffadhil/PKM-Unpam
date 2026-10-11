// Fungsi murni modul Profil & Staf (mudah dites).
import { RUMPUN_TU, STATUS_KEPEGAWAIAN } from '@/config/staf'

export const jenisNomor = (p) => (p.statusKepegawaian === 'PNS' ? 'NIP' : 'NUPTK')

// "196808121994031004" -> "19680812 199403 1 004"
export function formatNomorInduk(nomor) {
  const s = String(nomor ?? '')
  return s.length === 18 ? `${s.slice(0, 8)} ${s.slice(8, 14)} ${s.slice(14, 15)} ${s.slice(15)}` : s
}

export function labelKepegawaian(p) {
  if (p.statusKepegawaian === 'PNS' || p.statusKepegawaian === 'PPPK')
    return [p.statusKepegawaian, p.golongan].filter(Boolean).join(' ')
  return STATUS_KEPEGAWAIAN[p.statusKepegawaian] ?? p.statusKepegawaian
}

// NIP (PNS) 18 digit, NUPTK 16 digit. Mengembalikan pesan error atau '' bila valid.
export function validasiNomorInduk(nomor, statusKepegawaian) {
  const s = String(nomor ?? '').replace(/\s/g, '')
  if (!s) return 'Nomor induk wajib diisi.'
  if (!/^\d+$/.test(s)) return 'Nomor induk hanya boleh berisi angka.'
  if (statusKepegawaian === 'PNS' && s.length !== 18) return 'NIP PNS harus 18 digit.'
  if (statusKepegawaian !== 'PNS' && s.length !== 16) return 'NUPTK harus 16 digit.'
  return ''
}

export function inisial(nama) {
  const kata = nama.replace(/[.,]/g, ' ').split(/\s+/).filter((k) => k && !/^(dr|drs|dra|hj|h|s|m|ir)$/i.test(k))
  return (kata[0]?.[0] ?? '?').toUpperCase() + (kata[1]?.[0] ?? '').toUpperCase()
}

export function hitungStatistikStaf(list) {
  const pendidik = list.filter((p) => p.rumpun !== RUMPUN_TU)
  const tersertifikasi = pendidik.filter((p) => p.sertifikasiPpg).length
  return {
    total: list.length,
    pendidik: pendidik.length,
    tersertifikasi,
    rasioSertifikasi: pendidik.length ? Math.round((tersertifikasi / pendidik.length) * 100) : 0,
    tu: list.length - pendidik.length,
  }
}

export function saringStaf(list, { kata, rumpun, status }) {
  const k = (kata ?? '').trim().toLowerCase()
  return list.filter(
    (p) =>
      (!rumpun || p.rumpun === rumpun) &&
      (!status || p.statusKepegawaian === status) &&
      (!k || [p.nama, p.nomorInduk, p.bidang, p.jabatan].some((v) => String(v ?? '').toLowerCase().includes(k))),
  )
}

// "Struktur Tertinggi & NIP": urutan struktur dulu, lalu nomor induk.
export const urutkanStaf = (list) =>
  [...list].sort((a, b) => a.urutan - b.urutan || String(a.nomorInduk).localeCompare(String(b.nomorInduk)))

// CSV yang aman dibuka di Excel: BOM UTF-8, nomor induk dipaksa teks (tidak jadi 1.97E+17),
// dan sel teks berawalan = + - @ di-escape agar tidak dijalankan sebagai rumus.
const sel = (v) => {
  let t = String(v ?? '')
  if (/^[=+\-@]/.test(t)) t = `'${t}`
  return `"${t.replace(/"/g, '""')}"`
}
export function buatCsvStaf(list) {
  const kepala = ['Nama', 'NIP/NUPTK', 'Rumpun', 'Jabatan', 'Bidang', 'Pendidikan Terakhir', 'Institusi', 'Kepegawaian', 'Tampil Publik']
  const baris = list.map((p) =>
    [sel(p.nama), `="${p.nomorInduk}"`, sel(p.rumpun), sel(p.jabatan), sel(p.bidang), sel(p.pendidikan), sel(p.institusi), sel(labelKepegawaian(p)), sel(p.tampilPublik ? 'Ya' : 'Tidak')].join(','),
  )
  return '\uFEFF' + [kepala.map(sel).join(','), ...baris].join('\r\n')
}
