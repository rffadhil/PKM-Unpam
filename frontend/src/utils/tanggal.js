const format = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })

// '2026-02-24' → '24 Feb 2026'
export function formatTanggal(iso) {
  return format.format(new Date(`${iso}T00:00:00`))
}
