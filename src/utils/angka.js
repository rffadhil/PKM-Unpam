const format = new Intl.NumberFormat('id-ID')

// 48250 → '48.250'
export function formatAngka(n) {
  return format.format(n)
}
