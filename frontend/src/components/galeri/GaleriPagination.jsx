import { rentangHalaman } from '@/utils/galeri'

export default function GaleriPagination({ halaman, jumlahHalaman, onHalaman }) {
  const tombol = 'grid min-w-9 place-items-center rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors'
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-muted bg-surface-white px-5 py-3 shadow-sm">
      <p className="text-sm text-text-muted">
        Menampilkan halaman <strong className="text-primary">{halaman}</strong> dari <strong className="text-primary">{jumlahHalaman}</strong>
      </p>
      <nav aria-label="Halaman album" className="flex flex-wrap items-center gap-1.5">
        <button onClick={() => onHalaman(halaman - 1)} disabled={halaman <= 1} className={`${tombol} text-primary hover:bg-surface-light disabled:cursor-not-allowed disabled:text-text-muted/60`}>
          Sebelumnya
        </button>
        {rentangHalaman(halaman, jumlahHalaman).map((n, i) =>
          n === '…' ? (
            <span key={`e${i}`} aria-hidden className="px-1 text-text-muted">…</span>
          ) : (
            <button
              key={n}
              onClick={() => onHalaman(n)}
              aria-current={n === halaman ? 'page' : undefined}
              className={`${tombol} ${n === halaman ? 'bg-primary text-white' : 'text-primary hover:bg-surface-light'}`}
            >
              {n}
            </button>
          ),
        )}
        <button onClick={() => onHalaman(halaman + 1)} disabled={halaman >= jumlahHalaman} className={`${tombol} text-primary hover:bg-surface-light disabled:cursor-not-allowed disabled:text-text-muted/60`}>
          Selanjutnya
        </button>
      </nav>
    </div>
  )
}
