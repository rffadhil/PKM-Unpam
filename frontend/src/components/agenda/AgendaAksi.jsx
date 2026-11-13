import Icon from '@/components/ui/Icon'

// Tiga ikon aksi per baris: edit, hapus, lihat di portal.
export default function AgendaAksi({ agenda, onEdit, onHapus, hrefPublik = '/agenda' }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={() => onEdit(agenda)}
        title="Edit"
        aria-label={`Edit ${agenda.judul}`}
        className="rounded-md p-1.5 text-secondary transition-colors hover:bg-secondary/10"
      >
        <Icon name="edit" className="text-[18px]" />
      </button>
      <button
        type="button"
        onClick={() => onHapus(agenda)}
        title="Hapus"
        aria-label={`Hapus ${agenda.judul}`}
        className="rounded-md p-1.5 text-rose-600 transition-colors hover:bg-rose-50"
      >
        <Icon name="delete" className="text-[18px]" />
      </button>
      <a
        href={hrefPublik}
        target="_blank"
        rel="noopener noreferrer"
        title="Lihat di Portal"
        aria-label={`Lihat ${agenda.judul} di portal`}
        className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-light hover:text-primary"
      >
        <Icon name="visibility" className="text-[18px]" />
      </a>
    </div>
  )
}
