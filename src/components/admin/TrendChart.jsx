// Grafik area sederhana berbasis SVG (tanpa library chart).
// Kalau nanti butuh interaksi lebih, bisa diganti recharts tanpa mengubah props.

const W = 700
const H = 260
const PAD_TOP = 24

function toPoints(values, max) {
  const step = W / (values.length - 1)
  return values.map((v, i) => [i * step, H - (v / max) * (H - PAD_TOP)])
}

// Catmull-Rom -> bezier supaya garis melengkung halus
function smooth(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`
  }
  return d
}

export default function TrendChart({ pengunjung, pembaca, labels, puncak }) {
  const max = Math.max(...pengunjung) * 1.05
  const pA = toPoints(pengunjung, max)
  const pB = toPoints(pembaca, max)
  const lineA = smooth(pA)
  const lineB = smooth(pB)
  const areaB = `${lineB} L${W},${H} L0,${H} Z`
  const peak = pA[puncak.index]

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-64 w-full"
        role="img"
        aria-label="Grafik tren pengunjung dan pembaca artikel 30 hari terakhir"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="areaPembaca" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#82a700" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#82a700" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((r) => (
          <line key={r} x1="0" x2={W} y1={H * r} y2={H * r} stroke="#E2E8F0" strokeDasharray="4 6" />
        ))}
        <path d={areaB} fill="url(#areaPembaca)" />
        <path d={lineB} fill="none" stroke="#82a700" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        <path d={lineA} fill="none" stroke="#2f6b19" strokeWidth="3" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Tooltip puncak, diposisikan dengan persentase agar ikut responsif */}
      <div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-primary-container px-3 py-2 text-sm font-semibold text-cta-gold shadow-lg"
        style={{ left: `${(peak[0] / W) * 100}%`, top: `${(peak[1] / H) * 100 - 2}%` }}
      >
        {puncak.teks}
        <span className="block text-xs font-normal text-white/70">{puncak.tanggal}</span>
      </div>

      <div className="mt-3 flex justify-between text-sm text-text-muted">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  )
}
