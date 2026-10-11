import { useEffect } from 'react'
import Icon from '@/components/ui/Icon'

// Dialog konfirmasi untuk tindakan berbahaya (hapus). Esc / klik latar = batal.
export default function ConfirmDialog({ judul, pesan, labelKonfirmasi = 'Hapus', ikon = 'delete', onKonfirmasi, onBatal }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onBatal()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onBatal])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/50" onClick={onBatal} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-dialog"
        className="relative bg-surface-white rounded-xl shadow-xl border border-border-muted w-full max-w-md p-6"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Icon name={ikon} className="text-[22px]" />
          </div>
          <div>
            <h2 id="judul-dialog" className="font-headline-sm text-headline-sm font-bold text-primary">
              {judul}
            </h2>
            <p className="font-body-sm text-body-sm text-text-muted mt-1">{pesan}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            autoFocus
            onClick={onBatal}
            className="px-4 py-2 rounded-lg border border-border-muted text-on-surface text-label-lg font-label-lg hover:bg-surface-light transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onKonfirmasi}
            className="px-4 py-2 rounded-lg bg-error text-on-error text-label-lg font-label-lg font-bold hover:opacity-90 transition-opacity"
          >
            {labelKonfirmasi}
          </button>
        </div>
      </div>
    </div>
  )
}
