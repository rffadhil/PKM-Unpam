import Icon from '@/components/ui/Icon'
import { formatTanggalAlbum } from '@/utils/album'

// Baris tanggal kegiatan + penyelenggara.
export default function AlbumMeta({ album }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="inline-flex items-center gap-1.5 text-text-muted">
        <Icon name="calendar_today" className="text-[16px]" />
        <time dateTime={album.tanggal}>{formatTanggalAlbum(album.tanggal)}</time>
      </span>
      <span className="inline-flex min-w-0 items-center gap-1.5 font-medium text-on-surface">
        <Icon name="person" className="text-[16px] text-text-muted" />
        <span className="truncate">{album.penyelenggara}</span>
      </span>
    </div>
  )
}
