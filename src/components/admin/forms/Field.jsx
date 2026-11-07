// Pembungkus kolom form: label, kontrol (children), petunjuk, dan pesan kesalahan.
// Pasang `aria-describedby={`${id}-info`}` dan `aria-invalid` pada kontrolnya.
export default function Field({ id, label, wajib = false, petunjuk, galat, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-label-lg font-label-lg font-semibold text-on-surface mb-1.5">
        {label}
        {wajib && (
          <span className="text-error ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      <div id={`${id}-info`}>
        {galat ? (
          <p className="mt-1.5 text-xs text-error font-medium flex items-start gap-1" role="alert">
            {galat}
          </p>
        ) : (
          petunjuk && <p className="mt-1.5 text-xs text-text-muted">{petunjuk}</p>
        )}
      </div>
    </div>
  )
}
