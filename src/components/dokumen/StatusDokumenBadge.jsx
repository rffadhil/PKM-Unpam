// Pil status publikasi: Aktif di SIS / Nonaktif.
export default function StatusDokumenBadge({ aktif }) {
  return aktif ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container px-3 py-1.5 text-xs font-bold text-on-secondary-fixed-variant">
      <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
      Aktif di SIS
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1.5 text-xs font-bold text-text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-text-muted" aria-hidden="true" />
      Nonaktif
    </span>
  )
}
