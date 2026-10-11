import Icon from '@/components/ui/Icon'

// 4 kartu ringkasan di atas halaman. `stats` dihitung dari data (utils/agenda.hitungStatistik).
export default function AgendaStats({ stats }) {
  const kartu = [
    { label: 'Total Agenda', nilai: stats.total, satuan: 'Jadwal', ikon: 'calendar_month', box: 'bg-surface-container text-primary-container', cap: 'Terdaftar di sistem', capIkon: 'trending_up', capClass: 'text-secondary' },
    { label: 'Agenda Aktif / Mendatang', nilai: stats.aktif, satuan: 'Acara', ikon: 'event_upcoming', box: 'bg-secondary-container/50 text-secondary', cap: 'Siap dipublikasikan', capIkon: 'schedule', capClass: 'text-secondary' },
    { label: 'Terlaksana (Selesai)', nilai: stats.selesai, satuan: 'Acara', ikon: 'event_available', box: 'bg-blue-50 text-blue-700', cap: 'Arsip kegiatan selesai', capIkon: 'done_all', capClass: 'text-text-muted' },
    { label: 'Acara Prioritas / Ujian', nilai: stats.prioritas, satuan: 'Kegiatan', ikon: 'notifications_active', box: 'bg-red-50 text-error', cap: 'Wajib dihadiri civitas', capIkon: 'priority_high', capClass: 'text-error' },
  ]

  return (
    <section aria-label="Ringkasan agenda" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {kartu.map((k) => (
        <div key={k.label} className="flex items-start justify-between gap-3 rounded-2xl border border-border-muted bg-surface-white p-5 shadow-sm">
          <div className="min-w-0">
            <p className="text-sm text-text-muted">{k.label}</p>
            <p className="mt-2 font-headline-lg text-headline-lg-mobile text-primary">
              {k.nilai} <span className="font-body-md text-body-md font-normal text-text-muted">{k.satuan}</span>
            </p>
            <p className={`mt-2 flex items-center gap-1.5 text-sm font-medium ${k.capClass}`}>
              <Icon name={k.capIkon} className="text-[18px]" /> {k.cap}
            </p>
          </div>
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${k.box}`}>
            <Icon name={k.ikon} className="text-[24px]" />
          </span>
        </div>
      ))}
    </section>
  )
}
