const format = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })

// '2026-02-24' → '24 Feb 2026'
export function formatTanggal(iso) {
  return format.format(new Date(`${iso}T00:00:00`))
}

const formatPanjang = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

// Date → 'Selasa, 24 Februari 2026'
export function formatTanggalPanjang(tanggal) {
  return formatPanjang.format(tanggal)
}

// Tahun pelajaran dimulai Juli: Feb 2026 → '2025/2026', Okt 2026 → '2026/2027'
export function tahunPelajaran(tanggal) {
  const tahun = tanggal.getFullYear()
  const awal = tanggal.getMonth() >= 6 ? tahun : tahun - 1
  return `${awal}/${awal + 1}`
}
