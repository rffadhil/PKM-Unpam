// Tahun pelajaran dimulai Juli: Feb 2026 -> "2025/2026", Okt 2026 -> "2026/2027".
export function tahunPelajaran(tanggal = new Date()) {
  const tahun = tanggal.getFullYear()
  return tanggal.getMonth() >= 6 ? `${tahun}/${tahun + 1}` : `${tahun - 1}/${tahun}`
}

// "Selasa, 24 Februari 2026"
export function formatTanggalPanjang(tanggal = new Date()) {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(tanggal)
}

// Date -> "2026-02-24" (zona waktu perangkat), untuk atribut <time dateTime>.
export function isoTanggal(tanggal = new Date()) {
  return new Intl.DateTimeFormat('en-CA').format(tanggal)
}

function dariIso(iso) {
  if (!iso) return null
  const d = new Date(`${iso}T00:00:00`)
  return Number.isNaN(d.getTime()) ? null : d
}

// "2026-02-26" -> "FEB"
export function bulanSingkat(iso) {
  const d = dariIso(iso)
  return d ? new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(d).toUpperCase() : '-'
}

// "2026-03-02" -> "02"
export function hariDuaDigit(iso) {
  const d = dariIso(iso)
  return d ? String(d.getDate()).padStart(2, '0') : '--'
}
