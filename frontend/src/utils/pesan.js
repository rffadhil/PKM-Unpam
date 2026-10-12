// Fungsi murni modul Pesan Masuk (mudah dites). Semua tanggal diproses dalam zona WIB.
import { KATEGORI_MAP, STATUS_PESAN, TEMPLATE_RESPON } from '@/config/pesan'
import { gabungCsv, selCsv } from '@/utils/csvAman'

const TZ = 'Asia/Jakarta'
export const kunciTanggalWib = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d) // YYYY-MM-DD

// -> { tanggal: 'Hari ini' | 'Kemarin' | '23 Feb 2026', jam: '10:14 WIB' }
export function formatWaktuMasuk(iso, now = new Date()) {
  const d = new Date(iso)
  const hariIni = kunciTanggalWib(now)
  const kemarin = kunciTanggalWib(new Date(now.getTime() - 86400000))
  const kunci = kunciTanggalWib(d)
  const jam = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(d)
  const tanggal =
    kunci === hariIni ? 'Hari ini' : kunci === kemarin ? 'Kemarin' : new Intl.DateTimeFormat('id-ID', { timeZone: TZ, day: '2-digit', month: 'short', year: 'numeric' }).format(d).replace('.', '')
  return { tanggal, jam: `${jam} WIB` }
}

export function hitungStatistikPesan(list, now = new Date()) {
  const batas = now.getTime() - 7 * 86400000
  return {
    total: list.length,
    mingguIni: list.filter((t) => new Date(t.waktuMasuk).getTime() >= batas).length,
    belum: list.filter((t) => t.status === 'belum').length,
    selesai: list.filter((t) => t.status === 'selesai').length,
    wbs: list.filter((t) => t.kategori === 'wbs').length,
  }
}

export function saringTiket(list, { kategori, status, dari, sampai, kata }) {
  const k = (kata ?? '').trim().toLowerCase()
  return list.filter((t) => {
    const hari = kunciTanggalWib(new Date(t.waktuMasuk))
    return (
      (!kategori || t.kategori === kategori) &&
      (!status || t.status === status) &&
      (!dari || hari >= dari) &&
      (!sampai || hari <= sampai) &&
      (!k || [t.nomor, t.pengirim, t.subjek, t.email].some((v) => String(v ?? '').toLowerCase().includes(k)))
    )
  })
}

export const urutkanTiket = (list) => [...list].sort((a, b) => b.waktuMasuk.localeCompare(a.waktuMasuk))

// "PTSP-2026-090": nomor urut berikutnya untuk prefix + tahun (WIB) yang sama.
export function buatNomorTiket(list, kategoriKunci, now = new Date()) {
  const prefix = KATEGORI_MAP[kategoriKunci].prefix
  const tahun = kunciTanggalWib(now).slice(0, 4)
  const pola = new RegExp(`^${prefix}-${tahun}-(\\d+)$`)
  const maks = list.reduce((m, t) => Math.max(m, Number(pola.exec(t.nomor)?.[1] ?? 0)), 0)
  return `${prefix}-${tahun}-${String(maks + 1).padStart(3, '0')}`
}

export function isiTemplate(templateId, tiket) {
  const tpl = TEMPLATE_RESPON.find((t) => t.id === templateId) ?? TEMPLATE_RESPON.at(-1)
  return tpl.teks.replaceAll('{nama}', tiket.anonim ? 'Pelapor' : tiket.pengirim)
}

export function buatDrafAwal(tiket) {
  const templateId = KATEGORI_MAP[tiket.kategori].template
  return { templateId, teks: isiTemplate(templateId, tiket), surel: Boolean(tiket.email), wa: Boolean(tiket.whatsapp) }
}

export const urlValid = (u) => {
  try {
    return new URL(u).protocol === 'https:'
  } catch {
    return false
  }
}

// Validasi form tiket baru. Pelapor anonim (WBS) tidak wajib identitas/kontak.
export function validasiTiketBaru(f) {
  const e = {}
  if (!f.subjek.trim()) e.subjek = 'Subjek wajib diisi.'
  if (!f.isi.trim()) e.isi = 'Isi pesan wajib diisi.'
  if (!f.anonim) {
    if (!f.pengirim.trim()) e.pengirim = 'Nama pengirim wajib diisi.'
    if (!f.email.trim() && !f.whatsapp.trim()) e.kontak = 'Isi minimal satu kontak (email atau WhatsApp).'
    if (f.email.trim() && !/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Format email tidak valid.'
  }
  return e
}

export function buatCsvPesan(list) {
  const baris = list.map((t) => {
    const w = formatWaktuMasuk(t.waktuMasuk)
    return [selCsv(t.nomor), selCsv(t.anonim ? 'Anonim Terproteksi' : t.pengirim), selCsv(KATEGORI_MAP[t.kategori].label), selCsv(t.subjek), selCsv(`${w.tanggal} ${w.jam}`), selCsv(STATUS_PESAN[t.status].label)]
  })
  return gabungCsv(['No. Tiket', 'Pengirim', 'Kategori Layanan', 'Subjek', 'Waktu Masuk', 'Status'], baris)
}
