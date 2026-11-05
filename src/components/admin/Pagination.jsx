import clsx from 'clsx'
import Icon from '@/components/ui/Icon'
import { daftarHalaman } from '@/utils/paginasi'

const tombolPanah =
  'px-3 py-1 rounded-lg border border-border-muted bg-surface-white text-xs font-medium inline-flex items-center gap-1 transition-colors'

export default function Pagination({ halaman, totalHalaman, onUbah, dari, sampai, total, satuan = 'artikel' }) {
  return (
    <div className="px-5 py-3.5 bg-surface-light border-t border-border-muted flex flex-col sm:flex-row items-center justify-between gap-3 text-body-sm font-body-sm">
      <p className="text-text-muted text-xs">
        Menampilkan <span className="font-bold text-on-surface">{dari}</span> -{' '}
        <span className="font-bold text-on-surface">{sampai}</span> dari{' '}
        <span className="font-bold text-on-surface">{total}</span> {satuan}
      </p>
      <nav aria-label="Paginasi" className="flex items-center gap-1">
        <button
          type="button"
          disabled={halaman <= 1}
          onClick={() => onUbah(halaman - 1)}
          className={clsx(
            tombolPanah,
            halaman <= 1
              ? 'text-text-muted cursor-not-allowed opacity-60'
              : 'text-on-surface hover:bg-surface-light',
          )}
        >
          <Icon name="chevron_left" className="text-[16px]" />
          Sebelumnya
        </button>
        {daftarHalaman(totalHalaman, halaman).map((n, i) =>
          n === '…' ? (
            <span key={`titik-${i}`} className="px-1 text-text-muted text-xs">
              ...
            </span>
          ) : (
            <button
              key={n}
              type="button"
              aria-label={`Halaman ${n}`}
              aria-current={n === halaman ? 'page' : undefined}
              onClick={() => onUbah(n)}
              className={clsx(
                'w-8 h-8 rounded-lg text-xs flex items-center justify-center transition-colors',
                n === halaman
                  ? 'bg-secondary text-surface-white font-bold shadow-sm'
                  : 'border border-border-muted bg-surface-white text-on-surface hover:bg-surface-light font-medium',
              )}
            >
              {n}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={halaman >= totalHalaman}
          onClick={() => onUbah(halaman + 1)}
          className={clsx(
            tombolPanah,
            halaman >= totalHalaman
              ? 'text-text-muted cursor-not-allowed opacity-60'
              : 'text-on-surface hover:bg-surface-light',
          )}
        >
          Selanjutnya
          <Icon name="chevron_right" className="text-[16px]" />
        </button>
      </nav>
    </div>
  )
}
