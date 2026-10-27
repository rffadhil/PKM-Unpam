// Label + kolom + pesan bantuan/error untuk form album.
export default function AlbumField({ id, label, error, bantuan, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-primary">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-error">{error}</p>
      ) : (
        bantuan && <p className="mt-1 text-xs text-text-muted">{bantuan}</p>
      )}
    </div>
  )
}
