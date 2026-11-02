import Icon from '@/components/ui/Icon'

// Tiga ikon aksi per baris: edit, lihat di portal, hapus.
export default function AgendaAksi({ agenda, onEdit, onHapus, hrefPublik = '/agenda' }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => onEdit(agenda)}
        title="Edit"
        aria-label={`Edit ${agenda.judul}`}
        className="rounded-lg p-2 text-secondary transition-colors hover:bg-secondary/10"
      >
        <Icon name="edit" />
      </button>
      <a
        href={hrefPublik}
        target="_blank"
        rel="noopener noreferrer"
        title="Lihat di Portal"
        aria-label={`Lihat ${agenda.judul} di portal`}
        className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-light hover:text-primary"
      >
        <Icon name="visibility" />
      </a>
      <button
        type="button"
        onClick={() => onHapus(agenda)}
        title="Hapus"
        aria-label={`Hapus ${agenda.judul}`}
        className="rounded-lg p-2 text-error transition-colors hover:bg-error/10"
      >
        <Icon name="delete" />
      </button>
    </div>
  )
}
