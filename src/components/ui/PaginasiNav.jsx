import { rentangHalaman } from '@/utils/halaman'

// Navigasi halaman bersama: Sebelumnya, 1 2 3 … N, Selanjutnya.
export default function PaginasiNav({ halaman, jumlahHalaman, onHalaman, label = 'Halaman' }) {
  const tombol = 'grid min-w-9 place-items-center rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors'
  const netral = 'border-border-muted bg-surface-white text-primary hover:bg-surface-light disabled:cursor-not-allowed disabled:text-text-muted/60'
  return (
    <nav aria-label={label} className="flex flex-wrap items-center gap-1.5">
      <button onClick={() => onHalaman(halaman - 1)} disabled={halaman <= 1} className={`${tombol} ${netral}`}>Sebelumnya</button>
      {rentangHalaman(halaman, jumlahHalaman).map((n, i) =>
        n === '…' ? (
          <span key={`e${i}`} aria-hidden className="px-1 text-text-muted">…</span>
        ) : (
          <button key={n} onClick={() => onHalaman(n)} aria-current={n === halaman ? 'page' : undefined} className={`${tombol} ${n === halaman ? 'border-primary bg-primary text-white' : netral}`}>
            {n}
          </button>
        ),
      )}
      <button onClick={() => onHalaman(halaman + 1)} disabled={halaman >= jumlahHalaman} className={`${tombol} ${netral}`}>Selanjutnya</button>
    </nav>
  )
}
