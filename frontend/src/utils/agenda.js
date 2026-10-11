// Fungsi murni untuk modul Agenda (mudah dites). Tanggal memakai string ISO "YYYY-MM-DD".
const fmt = (opts) => new Intl.DateTimeFormat('id-ID', { timeZone: 'UTC', ...opts })
const toDate = (iso) => new Date(`${iso}T00:00:00Z`)
const bulanPanjang = (iso) => fmt({ month: 'long' }).format(toDate(iso))

export const hariAngka = (iso) => iso.slice(8, 10)
export const bulanSingkat = (iso) => fmt({ month: 'short' }).format(toDate(iso)).replace('.', '').toUpperCase()

// "18 Mei 2026" | "02 – 10 Juni 2026" | "28 Mei – 02 Juni 2026"
export function formatRentang(mulai, selesai) {
  if (!selesai || selesai === mulai) return `${hariAngka(mulai)} ${bulanPanjang(mulai)} ${mulai.slice(0, 4)}`
  if (mulai.slice(0, 7) === selesai.slice(0, 7))
    return `${hariAngka(mulai)} – ${hariAngka(selesai)} ${bulanPanjang(selesai)} ${selesai.slice(0, 4)}`
  return `${hariAngka(mulai)} ${bulanPanjang(mulai)} – ${hariAngka(selesai)} ${bulanPanjang(selesai)} ${selesai.slice(0, 4)}`
}

// Agenda aktif dulu (tanggal terdekat di atas), lalu yang selesai (terbaru di atas).
export function urutkanAgenda(list) {
  const aktif = list.filter((a) => a.status !== 'selesai').sort((a, b) => a.tanggalMulai.localeCompare(b.tanggalMulai))
  const selesai = list.filter((a) => a.status === 'selesai').sort((a, b) => b.tanggalMulai.localeCompare(a.tanggalMulai))
  return [...aktif, ...selesai]
}

export function hitungStatistik(list) {
  return {
    total: list.length,
    aktif: list.filter((a) => a.status !== 'selesai').length,
    selesai: list.filter((a) => a.status === 'selesai').length,
    prioritas: list.filter((a) => a.status === 'penting').length,
  }
}

export function saringAgenda(list, { kategori, status, periode, kata }) {
  const k = (kata ?? '').trim().toLowerCase()
  return list.filter(
    (a) =>
      (!kategori || a.kategori === kategori) &&
      (!status || a.status === status) &&
      (!periode || a.periode === periode) &&
      (!k || a.judul.toLowerCase().includes(k) || a.deskripsi.toLowerCase().includes(k)),
  )
}

// Ekspor iCalendar (.ics). Semua acara dibuat sebagai acara seharian karena `waktu` berupa teks bebas.
const esc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
const tgl = (iso) => iso.replaceAll('-', '')
function tambahHari(iso, n) {
  const d = toDate(iso)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export function buildIcs(list, now = new Date()) {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SMA Harapan Jaya//CMS Agenda//ID', 'CALSCALE:GREGORIAN']
  for (const a of list) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:agenda-${a.id}@smaharapanjaya.sch.id`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${tgl(a.tanggalMulai)}`,
      `DTEND;VALUE=DATE:${tgl(tambahHari(a.tanggalSelesai || a.tanggalMulai, 1))}`,
      `SUMMARY:${esc(a.judul)}`,
      `LOCATION:${esc(a.lokasi)}`,
      `DESCRIPTION:${esc([a.waktu, a.deskripsi].filter(Boolean).join(' - '))}`,
      'END:VEVENT',
    )
  }
  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}
