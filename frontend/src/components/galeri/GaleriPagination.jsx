import clsx from 'clsx'
import { daftarHalaman } from '@/components/ui/Paginasi'

const dasar = 'h-10 rounded-lg text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary'
const tepi = `${dasar} border border-border-muted bg-surface-white px-4 text-primary hover:bg-surface-light disabled:cursor-not-allowed disabled:bg-surface-light disabled:text-text-muted/60`

// Paginasi album: "Menampilkan halaman 1 dari 11" + Sebelumnya, 1 2 3 … 11, Selanjutnya.
export default function GaleriPagination({ halaman, jumlahHalaman, onHalaman }) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-border-muted bg-surface-white px-6 py-4 shadow-sm sm:flex-row">
      <p className="text-body-sm text-text-muted">
        Menampilkan halaman <strong className="font-semibold text-primary">{halaman}</strong> dari{' '}
        <strong className="font-semibold text-primary">{jumlahHalaman}</strong>
      </p>
      <nav aria-label="Halaman album" className="flex flex-wrap items-center gap-1.5">
        <button type="button" onClick={() => onHalaman(halaman - 1)} disabled={halaman <= 1} className={tepi}>
          Sebelumnya
        </button>
        {daftarHalaman(halaman, jumlahHalaman).map((n, i) =>
          n === '…' ? (
            <span key={`g${i}`} className="px-1.5 text-text-muted" aria-hidden="true">…</span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onHalaman(n)}
              aria-current={n === halaman ? 'page' : undefined}
              aria-label={`Halaman ${n}`}
              className={clsx(
                dasar,
                'min-w-10 px-3',
                n === halaman ? 'bg-primary text-white' : 'text-on-surface hover:bg-surface-light',
              )}
            >
              {n}
            </button>
          ),
        )}
        <button type="button" onClick={() => onHalaman(halaman + 1)} disabled={halaman >= jumlahHalaman} className={tepi}>
          Selanjutnya
        </button>
      </nav>
    </div>
  )
}
