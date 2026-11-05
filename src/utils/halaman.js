// Nomor halaman dengan elipsis: rentangHalaman(1, 11) -> [1, 2, 3, '…', 11]
export function rentangHalaman(saatIni, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const set = new Set([1, total, saatIni - 1, saatIni, saatIni + 1])
  if (saatIni <= 2) set.add(3)
  if (saatIni >= total - 1) set.add(total - 2)
  const urut = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
  const hasil = []
  urut.forEach((n, i) => {
    if (i && n - urut[i - 1] > 1) hasil.push('…')
    hasil.push(n)
  })
  return hasil
}
