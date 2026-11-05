import Icon from '@/components/ui/Icon'
import { bulanSingkat, formatRentang, hariAngka } from '@/utils/agenda'

// Kotak bulan/tanggal + rentang tanggal + jam. Tanggal format ISO (YYYY-MM-DD).
export default function AgendaTanggal({ mulai, selesai, waktu }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-primary-container text-center leading-none">
        <span>
          <span className="block text-xs font-bold text-tertiary-fixed">{bulanSingkat(mulai)}</span>
          <span className="mt-0.5 block text-xl font-bold text-white">{hariAngka(mulai)}</span>
        </span>
      </div>
      <div className="min-w-[8.5rem]">
        <p className="font-semibold text-primary">{formatRentang(mulai, selesai)}</p>
        <p className="mt-1 flex items-center gap-1 text-sm text-text-muted">
          <Icon name="schedule" className="text-[16px]" /> {waktu}
        </p>
      </div>
    </div>
  )
}
