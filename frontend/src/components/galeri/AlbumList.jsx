import AlbumCard from '@/components/galeri/AlbumCard'
import AlbumBaris from '@/components/galeri/AlbumBaris'
import Icon from '@/components/ui/Icon'

// Daftar album: grid 3 kolom (desktop) atau baris memanjang.
export default function AlbumList({ items, tampilan, onFoto, onEdit, onHapus }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border-muted bg-surface-white p-12 text-center">
        <Icon name="photo_library" className="text-4xl text-text-muted" />
        <p className="font-semibold text-primary">Belum ada album yang cocok</p>
        <p className="text-sm text-text-muted">Ubah kata kunci pencarian atau buat album baru.</p>
      </div>
    )
  }

  const Item = tampilan === 'list' ? AlbumBaris : AlbumCard
  return (
    <div className={tampilan === 'list' ? 'space-y-4' : 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3'}>
      {items.map((a) => (
        <Item key={a.id} album={a} onFoto={onFoto} onEdit={onEdit} onHapus={onHapus} />
      ))}
    </div>
  )
}
