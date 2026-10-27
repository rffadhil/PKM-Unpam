import { JABATAN_TONE } from '@/config/stafAdmin'

// Lencana jabatan (Kepala Sekolah, Wakasek, Pembina, ...).
export default function JabatanBadge({ jabatan, tone = 'abu' }) {
  return (
    <span className={`inline-block rounded px-2.5 py-1 text-xs font-bold leading-tight ${JABATAN_TONE[tone] ?? JABATAN_TONE.abu}`}>
      {jabatan}
    </span>
  )
}
