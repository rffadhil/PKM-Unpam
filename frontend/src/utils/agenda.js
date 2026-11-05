// Fungsi murni untuk modul Agenda (mudah dites). Tanggal memakai string ISO "YYYY-MM-DD".
const fmt = (opts) => new Intl.DateTimeFormat('id-ID', { timeZone: 'UTC', ...opts })
const toDate = (iso) => new Date(`${iso}T00:00:00Z`)
const bulanPanjang = (iso) => fmt({ month: 'long' }).format(toDate(iso))

export const hariAngka = (iso) => (iso ? String(iso).slice(8, 10) : '')
export const bulanSingkat = (iso) => (iso ? fmt({ month: 'short' }).format(toDate(iso)).replace('.', '').toUpperCase() : '')

export function parseTanggalKeLocalIso(val) {
  if (!val) return ''
  const s = String(val).trim()
  if (s.length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return s
  }
  const d = new Date(s)
  if (isNaN(d.getTime())) return s.slice(0, 10)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// "18 Mei 2026" | "02 – 10 Juni 2026" | "28 Mei – 02 Juni 2026"
export function formatRentang(mulai, selesai) {
  if (!mulai) return 'Tanggal belum diisi'
  const m = parseTanggalKeLocalIso(mulai)
  const s = selesai ? parseTanggalKeLocalIso(selesai) : null

  if (!s || s === m) return `${hariAngka(m)} ${bulanPanjang(m)} ${m.slice(0, 4)}`
  if (m.slice(0, 7) === s.slice(0, 7))
    return `${hariAngka(m)} – ${hariAngka(s)} ${bulanPanjang(s)} ${s.slice(0, 4)}`
  return `${hariAngka(m)} ${bulanPanjang(m)} – ${hariAngka(s)} ${bulanPanjang(s)} ${s.slice(0, 4)}`
}

// Agenda aktif dulu (tanggal terdekat di atas), lalu yang selesai (terbaru di atas).
export function urutkanAgenda(list) {
  if (!Array.isArray(list)) return []
  const aktif = list
    .filter((a) => a && a.status !== 'selesai')
    .sort((a, b) => {
      const tA = parseTanggalKeLocalIso(a.tanggalMulai || a.tanggal_mulai)
      const tB = parseTanggalKeLocalIso(b.tanggalMulai || b.tanggal_mulai)
      return tA.localeCompare(tB)
    })
  const selesai = list
    .filter((a) => a && a.status === 'selesai')
    .sort((a, b) => {
      const tA = parseTanggalKeLocalIso(a.tanggalMulai || a.tanggal_mulai)
      const tB = parseTanggalKeLocalIso(b.tanggalMulai || b.tanggal_mulai)
      return tB.localeCompare(tA)
    })
  return [...aktif, ...selesai]
}

export function hitungStatistik(list) {
  if (!Array.isArray(list)) return { total: 0, aktif: 0, selesai: 0, prioritas: 0 }
  return {
    total: list.length,
    aktif: list.filter((a) => a && a.status !== 'selesai').length,
    selesai: list.filter((a) => a && a.status === 'selesai').length,
    prioritas: list.filter((a) => a && a.status === 'penting').length,
  }
}

// Memilih agenda mendatang yang paling relevan untuk beranda
export function pilihAgendaMendatang(list, limit = 3) {
  if (!Array.isArray(list) || list.length === 0) return []

  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const hariIniIso = `${yyyy}-${mm}-${dd}`

  const mendatang = []
  const lainnya = []

  for (const a of list) {
    if (!a) continue
    const tSelesai = a.tanggalSelesai || a.tanggal_selesai ? parseTanggalKeLocalIso(a.tanggalSelesai || a.tanggal_selesai) : null
    const tMulai = a.tanggalMulai || a.tanggal_mulai ? parseTanggalKeLocalIso(a.tanggalMulai || a.tanggal_mulai) : ''
    const batas = tSelesai || tMulai

    if ((batas && batas >= hariIniIso) || a.status === 'penting' || a.status === 'mendatang') {
      mendatang.push(a)
    } else {
      lainnya.push(a)
    }
  }

  // Urutkan agenda mendatang dari tanggal terdekat ke depan
  mendatang.sort((a, b) => {
    const tA = parseTanggalKeLocalIso(a.tanggalMulai || a.tanggal_mulai)
    const tB = parseTanggalKeLocalIso(b.tanggalMulai || b.tanggal_mulai)
    return tA.localeCompare(tB)
  })

  // Urutkan agenda lainnya dari yang paling baru dibuat atau tanggal terbaru
  lainnya.sort((a, b) => {
    const cA = String(a.created_at || a.createdAt || a.id || '')
    const cB = String(b.created_at || b.createdAt || b.id || '')
    if (cA && cB && cA !== cB) return cB.localeCompare(cA)
    const tA = parseTanggalKeLocalIso(a.tanggalMulai || a.tanggal_mulai)
    const tB = parseTanggalKeLocalIso(b.tanggalMulai || b.tanggal_mulai)
    return tB.localeCompare(tA)
  })

  // Gabungkan agar selalu terisi sampai limit (misal 3 kartu di landing page)
  return [...mendatang, ...lainnya].slice(0, limit)
}

export function saringAgenda(list, { kategori, status, periode, kata } = {}) {
  if (!Array.isArray(list)) return []
  const k = (kata ?? '').trim().toLowerCase()
  const kat = (kategori ?? '').trim().toLowerCase()
  const per = (periode ?? '').trim().toLowerCase()
  const stat = (status ?? '').trim().toLowerCase()

  return list.filter((a) => {
    if (!a) return false

    if (kat && String(a.kategori || '').trim().toLowerCase() !== kat) {
      return false
    }

    if (per && String(a.periode || '').trim().toLowerCase() !== per) {
      return false
    }

    if (stat && String(a.status || '').trim().toLowerCase() !== stat) {
      return false
    }

    if (k) {
      const matchJudul = a.judul && a.judul.toLowerCase().includes(k)
      const matchDeskripsi = a.deskripsi && a.deskripsi.toLowerCase().includes(k)
      const matchPenyelenggara = a.penyelenggara && a.penyelenggara.toLowerCase().includes(k)
      const matchPic = a.pic && a.pic.toLowerCase().includes(k)
      const matchLokasi = a.lokasi && a.lokasi.toLowerCase().includes(k)
      if (!matchJudul && !matchDeskripsi && !matchPenyelenggara && !matchPic && !matchLokasi) {
        return false
      }
    }

    return true
  })
}

// Ekspor iCalendar (.ics). Semua acara dibuat sebagai acara seharian karena `waktu` berupa teks bebas.
const esc = (s) => String(s ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
const tgl = (iso) => String(iso || '').replaceAll('-', '')
function tambahHari(iso, n) {
  const d = toDate(iso)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export function buildIcs(list, now = new Date()) {
  if (!Array.isArray(list)) return ''
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SMA Harapan Jaya//CMS Agenda//ID', 'CALSCALE:GREGORIAN']
  for (const a of list) {
    if (!a || !a.tanggalMulai) continue
    const m = parseTanggalKeLocalIso(a.tanggalMulai)
    const s = a.tanggalSelesai ? parseTanggalKeLocalIso(a.tanggalSelesai) : m
    lines.push(
      'BEGIN:VEVENT',
      `UID:agenda-${a.id}@smaharapanjaya.sch.id`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${tgl(m)}`,
      `DTEND;VALUE=DATE:${tgl(tambahHari(s, 1))}`,
      `SUMMARY:${esc(a.judul)}`,
      `LOCATION:${esc(a.lokasi)}`,
      `DESCRIPTION:${esc([a.waktu, a.deskripsi].filter(Boolean).join(' - '))}`,
      'END:VEVENT',
    )
  }
  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}
