import clsx from 'clsx'
import { kategoriBerita } from '@/config/kategoriBerita'

const gaya = Object.fromEntries(kategoriBerita.map((k) => [k.nama, k]))

// Label kategori berwarna dengan titik di kiri.
export default function ChipKategori({ nama }) {
  const k = gaya[nama]
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
        k?.chip ?? 'bg-slate-100 text-slate-700',
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full', k?.titik ?? 'bg-slate-400')} />
      {nama || 'Tanpa kategori'}
    </span>
  )
}
