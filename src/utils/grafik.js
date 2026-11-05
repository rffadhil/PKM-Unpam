// Pembantu menggambar grafik garis/area di SVG (viewBox 700 x 200).
export const LEBAR = 700
export const Y_ATAS = 20
export const Y_DASAR = 195

// Nilai → titik {x, y}. `maks` = nilai tertinggi sumbu Y.
export function petaTitik(nilai, maks) {
  const langkah = nilai.length > 1 ? LEBAR / (nilai.length - 1) : 0
  return nilai.map((v, i) => ({
    x: Math.round(i * langkah * 100) / 100,
    y: Math.round((Y_DASAR - (v / maks) * (Y_DASAR - Y_ATAS)) * 100) / 100,
  }))
}

// Kurva halus (Catmull-Rom → Bezier) melewati semua titik.
export function kurvaHalus(titik) {
  if (titik.length < 2) return ''
  let d = `M ${titik[0].x},${titik[0].y}`
  for (let i = 0; i < titik.length - 1; i += 1) {
    const p0 = titik[i - 1] ?? titik[i]
    const p1 = titik[i]
    const p2 = titik[i + 1]
    const p3 = titik[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2.x},${p2.y}`
  }
  return d
}

// Tutup kurva menjadi bidang di atas garis dasar (untuk isian gradien).
export function bidangArea(titik) {
  if (titik.length < 2) return ''
  const akhir = titik[titik.length - 1]
  return `${kurvaHalus(titik)} L ${akhir.x},${Y_DASAR} L ${titik[0].x},${Y_DASAR} Z`
}

// Batas atas sumbu Y dibulatkan ke atas (kelipatan 100 / 1000 sesuai besar data) + ruang 10%.
export function batasAtas(nilai) {
  const maks = Math.max(...nilai) * 1.1
  const kelipatan = maks > 5000 ? 1000 : 100
  return Math.ceil(maks / kelipatan) * kelipatan
}
