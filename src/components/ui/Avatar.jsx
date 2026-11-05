import clsx from 'clsx'

const TONE = {
  netral: 'bg-surface-container-high text-primary',
  hijau: 'bg-emerald-100 text-emerald-900',
  kuning: 'bg-amber-100 text-amber-900',
  biru: 'bg-blue-100 text-blue-900',
  abu: 'bg-slate-200 text-primary',
}
const UKURAN = { sm: 'w-7 h-7 text-xs', md: 'w-8 h-8 text-xs', lg: 'w-9 h-9 text-sm' }

// Foto bila ada `src`, selain itu inisial berwarna.
export default function Avatar({ nama, inisial, src, tone = 'netral', ukuran = 'sm', online = false }) {
  return (
    <span
      className={clsx(
        'relative inline-flex shrink-0 items-center justify-center rounded-full font-bold',
        UKURAN[ukuran],
        !src && TONE[tone],
        src && 'overflow-hidden bg-surface-container border border-border-muted',
      )}
    >
      {src ? (
        <img className="w-full h-full object-cover" src={src} alt={nama ?? ''} />
      ) : (
        <span aria-hidden="true">{inisial}</span>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-primary-container" />
      )}
    </span>
  )
}
