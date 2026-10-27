import clsx from 'clsx'
import Icon from '@/components/ui/Icon'
import { TAMPILAN_ALBUM } from '@/config/galeriAdmin'

// "Menampilkan 6 dari 64 Album Dokumentasi Aktif" + tombol ganti tampilan grid/daftar.
export default function GaleriToolbar({ ditampilkan, total, tampilan, onTampilan }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-body-md text-text-muted">
        Menampilkan <strong className="font-semibold text-primary">{ditampilkan}</strong> dari{' '}
        <strong className="font-semibold text-primary">{total}</strong> Album Dokumentasi Aktif
      </p>
      <div role="group" aria-label="Pilih tampilan album" className="flex items-center gap-2">
        {TAMPILAN_ALBUM.map((t) => (
          <button
            key={t.nilai}
            type="button"
            aria-label={t.label}
            aria-pressed={tampilan === t.nilai}
            onClick={() => onTampilan(t.nilai)}
            className={clsx(
              'rounded-lg border p-2 transition-colors',
              tampilan === t.nilai
                ? 'border-primary bg-surface-white text-primary shadow-sm'
                : 'border-border-muted bg-surface-white text-text-muted hover:text-primary',
            )}
          >
            <Icon name={t.ikon} className="text-[22px]" />
          </button>
        ))}
      </div>
    </div>
  )
}
