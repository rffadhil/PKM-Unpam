
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Icon from '@/components/ui/Icon'

export default function ModalGaleri({
  judul,
  onTutup,
  children,
  footer,
  lebar = 'max-w-3xl',
}) {
  useEffect(() => {
    const scrollSebelumnya = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const tekan = (e) => {
      if (e.key === 'Escape' && onTutup) {
        onTutup()
      }
    }

    document.addEventListener('keydown', tekan)

    return () => {
      document.body.style.overflow = scrollSebelumnya
      document.removeEventListener('keydown', tekan)
    }
  }, [onTutup])

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex h-screen h-[100dvh] w-screen items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && onTutup) {
          onTutup()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={judul}
        className={`flex max-h-[92dvh] w-full ${lebar} min-w-0 flex-col overflow-hidden rounded-xl bg-surface-white shadow-2xl sm:rounded-2xl`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border-muted px-4 py-4 sm:px-6">
          <h2 className="truncate text-lg font-bold text-primary">
            {judul}
          </h2>

          <button
            type="button"
            onClick={onTutup}
            disabled={!onTutup}
            aria-label="Tutup"
            className="shrink-0 rounded-full p-1.5 text-text-muted hover:bg-surface-light hover:text-primary disabled:opacity-50"
          >
            <Icon name="close" className="text-[22px]" />
          </button>
        </header>

        {/* KONTEN */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
          {children}
        </div>

        {/* FOOTER */}
        {footer && (
          <footer className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-border-muted bg-surface-light/60 px-4 py-4 sm:px-6">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body
  )
}
