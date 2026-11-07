import { useEffect } from 'react'
import Icon from '@/components/ui/Icon'

// Cangkang modal: overlay, judul, tombol tutup, tutup dengan Esc / klik latar.
export default function ModalGaleri({ judul, onTutup, children, footer, lebar = 'max-w-xl' }) {
  useEffect(() => {
    const tekan = (e) => e.key === 'Escape' && onTutup()
    document.addEventListener('keydown', tekan)
    return () => document.removeEventListener('keydown', tekan)
  }, [onTutup])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onTutup()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={judul}
        className={`flex max-h-[90vh] w-full ${lebar} flex-col overflow-hidden rounded-2xl bg-surface-white shadow-2xl`}
      >
        <header className="flex items-center justify-between gap-4 border-b border-border-muted px-6 py-4">
          <h2 className="truncate text-lg font-bold text-primary">{judul}</h2>
          <button
            type="button"
            onClick={onTutup}
            aria-label="Tutup"
            className="rounded-full p-1.5 text-text-muted hover:bg-surface-light hover:text-primary"
          >
            <Icon name="close" className="text-[22px]" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="flex justify-end gap-3 border-t border-border-muted bg-surface-light/60 px-6 py-4">{footer}</footer>}
      </div>
    </div>
  )
}
