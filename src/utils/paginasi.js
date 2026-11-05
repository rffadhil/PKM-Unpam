// Contoh: halaman 1 dari 10 → [1, 2, 3, '…', 10]; halaman 5 dari 10 → [1, '…', 4, 5, 6, '…', 10]
export function daftarHalaman(total, aktif) {
  const set = new Set([1, total, aktif - 1, aktif, aktif + 1])
  if (aktif <= 2) set.add(3)
  if (aktif >= total - 1) set.add(total - 2)
  const urut = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
  const hasil = []
  urut.forEach((n, i) => {
    if (i > 0 && n - urut[i - 1] > 1) hasil.push('…')
    hasil.push(n)
  })
  return hasil
}
