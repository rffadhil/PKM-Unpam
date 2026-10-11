// Field form dengan label, ikon kiri, pesan error, dan slot kanan.
// Dipakai di Login, dan bisa dipakai ulang di form admin lain.
export default function FormField({ id, label, icon: Icon, error, aside, right, children }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={id} className="font-title-md text-title-md text-primary">
          {label}
        </label>
        {aside}
      </div>
      <div
        className={`flex items-center gap-3 rounded-xl border bg-surface-white px-4 py-3 transition-shadow focus-within:ring-2 ${
          error
            ? 'border-error focus-within:ring-error/20'
            : 'border-border-muted focus-within:border-secondary focus-within:ring-secondary/20'
        }`}
      >
        {Icon && <Icon size={20} className="shrink-0 text-text-muted" aria-hidden />}
        {children}
        {right}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
}
