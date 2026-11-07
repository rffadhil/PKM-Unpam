import Icon from '@/components/ui/Icon'

// Isian pengaturan: label, kolom (input/select/textarea) dengan ikon opsional, bantuan, error.
export default function FieldPengaturan({ id, label, bantuan, error, ikon, as: Elemen = 'input', className = '', children, ...props }) {
  const gaya = `block w-full rounded-xl border bg-surface-white py-3 text-sm text-on-surface placeholder:text-text-muted/70 focus:ring-2 ${
    ikon ? 'pl-10 pr-3.5' : 'px-4'
  } ${error ? 'border-error focus:border-error focus:ring-error/20' : 'border-border-muted focus:border-secondary focus:ring-secondary/20'}`
  const posisiIkon = Elemen === 'textarea' ? 'top-3.5' : 'top-1/2 -translate-y-1/2'

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-body-sm font-bold text-primary">{label}</label>
      <div className="relative">
        {ikon && (
          <span className={`pointer-events-none absolute left-3 text-text-muted ${posisiIkon}`}>
            <Icon name={ikon} className="text-[20px]" />
          </span>
        )}
        <Elemen
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={gaya}
          {...props}
        >
          {children}
        </Elemen>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-error">{error}</p>
      ) : (
        bantuan && <p className="mt-1.5 text-xs text-text-muted">{bantuan}</p>
      )}
    </div>
  )
}
