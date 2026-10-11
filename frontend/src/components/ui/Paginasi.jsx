// Tombol halaman: Sebelumnya, 1 2 3 … 11, Selanjutnya.
export function daftarHalaman(sekarang, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const set = new Set([1, 2, total, sekarang - 1, sekarang, sekarang + 1].filter((n) => n >= 1 && n <= total))
  const urut = [...set].sort((a, b) => a - b)
  return urut.flatMap((n, i) => (i > 0 && n - urut[i - 1] > 1 ? ['…', n] : [n]))
}

export default function Paginasi({ halaman, jumlahHalaman, onHalaman, label = 'Halaman' }) {
  const tombol = 'rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors'
  const netral = 'border-border-muted bg-surface-white text-primary hover:bg-surface-light disabled:cursor-not-allowed disabled:text-text-muted/60'
  return (
    <nav aria-label={label} className="flex flex-wrap items-center gap-1.5">
      <button onClick={() => onHalaman(halaman - 1)} disabled={halaman <= 1} className={`${tombol} ${netral}`}>
        Sebelumnya
      </button>
      {daftarHalaman(halaman, jumlahHalaman).map((n, i) =>
        n === '…' ? (
          <span key={`g${i}`} className="px-1 text-text-muted">…</span>
        ) : (
          <button
            key={n}
            onClick={() => onHalaman(n)}
            aria-current={n === halaman ? 'page' : undefined}
            className={`${tombol} ${n === halaman ? 'border-primary bg-primary text-white' : netral}`}
          >
            {n}
          </button>
        ),
      )}
      <button onClick={() => onHalaman(halaman + 1)} disabled={halaman >= jumlahHalaman} className={`${tombol} ${netral}`}>
        Selanjutnya
      </button>
    </nav>
  )
}
