import Icon from '@/components/ui/Icon'
import AlbumCover from '@/components/galeri/AlbumCover'
import AlbumBadge from '@/components/galeri/AlbumBadge'
import AlbumMeta from '@/components/galeri/AlbumMeta'
import AlbumAksi from '@/components/galeri/AlbumAksi'

// Satu album untuk tampilan daftar (sampul di kiri, info di kanan).
export default function AlbumBaris({ album, onFoto, onEdit, onHapus }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border-muted bg-surface-white shadow-sm sm:flex-row">
      <div className="relative h-48 shrink-0 bg-surface-container sm:h-auto sm:w-64">
        <AlbumCover key={album.cover} src={album.cover} alt={`Sampul album ${album.judul}`} className="h-full w-full" />
        <AlbumBadge album={album} className="absolute left-3 top-3" />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-white">
          <Icon name="photo_camera" className="text-[16px]" />
          {album.jumlahFoto} Foto
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold leading-snug text-primary">{album.judul}</h3>
        <p className="line-clamp-2 text-body-sm text-text-muted">{album.deskripsi}</p>
        <div className="mt-auto space-y-4">
          <div className="border-t border-border-muted pt-4">
            <AlbumMeta album={album} />
          </div>
          <AlbumAksi album={album} onFoto={onFoto} onEdit={onEdit} onHapus={onHapus} />
        </div>
      </div>
    </article>
  )
}
