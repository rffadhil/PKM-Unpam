import Icon from '@/components/ui/Icon'

// Satu isian saluran kontak: label kecil + kolom (opsional font mono, opsional tombol buka tautan).
export default function FieldKontak({ id, label, nilai, onUbah, mono = false, error, tautan }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-body-sm text-text-muted">{label}</label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="text"
          value={nilai}
          onChange={(e) => onUbah(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`block w-full min-w-0 rounded-xl border bg-surface-white px-4 py-3 text-sm text-on-surface focus:ring-2 ${
            error ? 'border-error focus:border-error focus:ring-error/20' : 'border-border-muted focus:border-secondary focus:ring-secondary/20'
          } ${mono ? 'font-mono' : ''}`}
        />
        {tautan !== undefined && (
          tautan ? (
            <a
              href={tautan}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buka tautan di tab baru"
              className="shrink-0 rounded-xl border border-border-muted bg-surface-white p-3 text-text-muted hover:bg-surface-light hover:text-primary"
            >
              <Icon name="open_in_new" className="text-[20px]" />
            </a>
          ) : (
            <span aria-hidden="true" className="shrink-0 rounded-xl border border-border-muted bg-surface-light p-3 text-text-muted/50">
              <Icon name="open_in_new" className="text-[20px]" />
            </span>
          )
        )}
      </div>
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-error">{error}</p>}
    </div>
  )
}
