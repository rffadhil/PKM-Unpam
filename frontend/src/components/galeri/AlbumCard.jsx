import Icon from '@/components/ui/Icon'
import { GRADASI_KATEGORI, STATUS_ALBUM } from '@/config/galeri'
import { formatTanggalSingkat } from '@/utils/galeri'

function Sampul({ album, className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-surface-container ${className}`}>
      {album.cover ? (
        <img src={album.cover} alt={`Sampul album ${album.judul}`} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div className={`grid h-full w-full place-items-center bg-gradient-to-br ${GRADASI_KATEGORI[album.kategori] ?? 'from-primary-container to-secondary'}`} role="img" aria-label={`Sampul album ${album.judul} (belum ada foto)`}>
          <Icon name="photo_camera" className="text-[56px] text-white/40" />
        </div>
      )}
      <div className="absolute left-3 top-3 flex items-center gap-2">
        <span className="rounded-md bg-primary/90 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white">{album.lencana}</span>
        <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-bold ${STATUS_ALBUM[album.status].badge}`}>
          <Icon name={STATUS_ALBUM[album.status].ikon} className="text-[14px]" /> {STATUS_ALBUM[album.status].label}
        </span>
      </div>
      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-primary/80 px-2.5 py-1 text-xs font-semibold text-white">
        <Icon name="photo_camera" className="text-[14px]" /> {album.jumlahFoto} Foto
      </span>
    </div>
  )
}

// `tampilan`: 'grid' (kartu vertikal) | 'list' (baris horizontal)
export default function AlbumCard({ album, tampilan = 'grid', onFoto, onEdit, onHapus }) {
  const list = tampilan === 'list'
  const btn = 'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors'

  return (
    <article className={`overflow-hidden rounded-2xl border border-border-muted bg-surface-white shadow-sm ${list ? 'flex flex-col sm:flex-row' : 'flex flex-col'}`}>
      <Sampul album={album} className={list ? 'h-44 sm:h-auto sm:w-60 sm:shrink-0' : 'aspect-[16/10]'} />
      <div className="flex flex-1 flex-col p-5">
        <h3 className={`font-bold leading-snug text-primary ${list ? 'text-lg' : 'line-clamp-2 min-h-[3.5rem] text-headline-sm'}`}>{album.judul}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-text-muted">{album.deskripsi}</p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border-muted pt-3 text-xs text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="calendar_today" className="text-[14px]" /> {formatTanggalSingkat(album.tanggal)}
          </span>
          <span className="inline-flex items-center gap-1.5 truncate font-medium text-on-surface-variant">
            <Icon name="person" className="text-[14px]" /> {album.penyelenggara}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button onClick={() => onFoto(album)} className={`${btn} bg-secondary-container/50 font-semibold text-secondary-dark hover:bg-secondary-container`}>
            <Icon name="photo_library" className="text-[16px]" /> Foto ({album.jumlahFoto})
          </button>
          <button onClick={() => onEdit(album)} className={`${btn} text-on-surface-variant hover:bg-secondary/10 hover:text-secondary`} aria-label={`Edit album ${album.judul}`}>
            <Icon name="edit" className="text-[16px]" /> Edit
          </button>
          <button onClick={() => onHapus(album)} className={`${btn} text-text-muted hover:bg-error/10 hover:text-error`} aria-label={`Hapus album ${album.judul}`}>
            <Icon name="delete" className="text-[16px]" /> Hapus
          </button>
        </div>
      </div>
    </article>
  )
}
