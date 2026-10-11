import Icon from '@/components/ui/Icon'
import AlbumCard from './AlbumCard'

// Baris jumlah + toggle tampilan + daftar album.
export default function AlbumList({ items, total, tampilan, onTampilan, onFoto, onEdit, onHapus }) {
  const toggle = (nilai, ikon, label) => (
    <button
      type="button"
      onClick={() => onTampilan(nilai)}
      aria-pressed={tampilan === nilai}
      aria-label={label}
      className={`grid h-9 w-9 place-items-center rounded-lg border transition-colors ${
        tampilan === nilai ? 'border-border-muted bg-surface-white text-primary shadow-sm' : 'border-transparent text-text-muted hover:bg-surface-container'
      }`}
    >
      <Icon name={ikon} />
    </button>
  )

  return (
    <section aria-label="Daftar album">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-text-muted">
          Menampilkan <strong className="text-primary">{items.length}</strong> dari <strong className="text-primary">{total}</strong> Album Dokumentasi Aktif
        </p>
        <div className="flex gap-1">
          {toggle('grid', 'grid_view', 'Tampilan kartu')}
          {toggle('list', 'view_list', 'Tampilan daftar')}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-muted bg-surface-white p-10 text-center text-text-muted">
          Tidak ada album yang cocok. Ubah kategori atau kata kunci pencarian.
        </p>
      ) : (
        <div className={tampilan === 'grid' ? 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
          {items.map((a) => (
            <AlbumCard key={a.id} album={a} tampilan={tampilan} onFoto={onFoto} onEdit={onEdit} onHapus={onHapus} />
          ))}
        </div>
      )}
    </section>
  )
}
