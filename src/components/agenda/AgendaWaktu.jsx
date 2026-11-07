import Icon from '@/components/ui/Icon'
import { formatRentang } from '@/utils/agenda'

// Rentang tanggal (tebal) + jam (kecil, berikon jam). Tanggal format ISO (YYYY-MM-DD).
// Aman bila tanggal belum terisi, supaya satu data rusak tidak menjatuhkan seluruh tabel.
export default function AgendaWaktu({ mulai, selesai, waktu }) {
  return (
    <div className="min-w-[8.5rem]">
      <p className="font-bold text-primary">{mulai ? formatRentang(mulai, selesai) : 'Tanggal belum diisi'}</p>
      {waktu && (
        <p className="mt-1 flex items-center gap-1 text-sm text-text-muted">
          <Icon name="schedule" className="text-[16px]" /> {waktu}
        </p>
      )}
    </div>
  )
}
