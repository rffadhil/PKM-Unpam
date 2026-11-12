
import Icon from '@/components/ui/Icon'

const dasar =
  'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary'

// Tombol Tambah Foto / Edit / Hapus pada tiap album.
export default function AlbumAksi({ album, onFoto, onEdit, onHapus }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Tombol Tambah Foto */}
      <button
        type="button"
        onClick={() => onFoto(album)}
        aria-label={`Tambah foto pada album ${album.judul}. Saat ini ${album.jumlahFoto} foto`}
        className={`${dasar} bg-secondary-container/40 text-secondary-dark hover:bg-secondary-container`}
      >
        <Icon name="photo_library" className="text-[18px]" />
        Tambah Foto
      </button>

      {/* Tombol Edit */}
      <button
        type="button"
        onClick={() => onEdit(album)}
        aria-label={`Edit album ${album.judul}`}
        className={`${dasar} bg-surface-light text-primary hover:bg-surface-container`}
      >
        <Icon name="edit" className="text-[18px]" />
        Edit
      </button>

      {/* Tombol Hapus */}
      <button
        type="button"
        onClick={() => onHapus(album)}
        aria-label={`Hapus album ${album.judul}`}
        className={`${dasar} bg-surface-light text-text-muted hover:bg-error-container hover:text-on-error-container`}
      >
        <Icon name="delete" className="text-[18px]" />
        Hapus
      </button>
    </div>
  )
}
