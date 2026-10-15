import clsx from 'clsx'
import { statusBerita } from '@/config/kategoriBerita'

const gaya = Object.fromEntries(statusBerita.map((s) => [s.nilai, s]))

// Badge status artikel (Terbit / Draf).
export default function BadgeStatus({ status }) {
  const s = gaya[status]
  return (
    <span className={clsx('inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-bold', s?.kelas)}>
      {s?.label ?? status}
    </span>
  )
}
