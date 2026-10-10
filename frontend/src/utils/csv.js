// Bangun teks CSV. Nilai yang mengandung koma, kutip, atau baris baru dibungkus kutip.
function escapeSel(nilai) {
  const teks = String(nilai ?? '')
  return /[",\n\r]/.test(teks) ? `"${teks.replace(/"/g, '""')}"` : teks
}

export function bangunCsv(kolom, baris) {
  const header = kolom.map((k) => escapeSel(k.judul)).join(',')
  const isi = baris.map((b) => kolom.map((k) => escapeSel(k.nilai(b))).join(','))
  return [header, ...isi].join('\r\n')
}

// Unduh teks sebagai file di browser. BOM ditambahkan agar Excel membaca UTF-8 dengan benar.
export function unduhFile(namaFile, isi, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob(['\uFEFF', isi], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = namaFile
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
