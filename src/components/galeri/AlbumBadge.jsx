import Icon from '@/components/ui/Icon'
import { STATUS_ALBUM } from '@/config/galeriAdmin'

// Lencana di pojok kiri atas sampul: kategori + status tayang/draft.
export default function AlbumBadge({ album, className = '' }) {
  const status = STATUS_ALBUM[album.status] ?? STATUS_ALBUM.draft
  const tayang = album.status === 'tayang'
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
        {album.kategori}
      </span>
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold ${
          tayang ? 'bg-secondary text-white' : 'bg-cta-gold text-primary'
        }`}
      >
        <Icon name={status.ikon} className="text-[14px]" />
        {status.label}
      </span>
    </div>
  )
}
