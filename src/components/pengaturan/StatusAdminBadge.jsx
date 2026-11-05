// Pil status akun admin: Aktif / Nonaktif.
export default function StatusAdminBadge({ aktif }) {
  return aktif ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container px-2.5 py-1 text-xs font-bold text-on-secondary-fixed-variant">
      <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
      Aktif
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-bold text-text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-text-muted" aria-hidden="true" />
      Nonaktif
    </span>
  )
}
