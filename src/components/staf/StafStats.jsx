import Icon from '@/components/ui/Icon'

export default function StafStats({ stats, akreditasi }) {
  const kartu = [
    { label: 'Total Civitas & Staf', nilai: stats.total, satuan: 'Orang', ikon: 'badge', box: 'bg-secondary-container/60 text-secondary', cap: '100% Tercatat Dapodik', capIkon: 'check_circle' },
    { label: 'Guru Tersertifikasi', nilai: stats.tersertifikasi, satuan: 'Pendidik', ikon: 'verified_user', box: 'bg-tertiary-fixed/40 text-tertiary', cap: `${stats.rasioSertifikasi}% Rasio Sertifikasi PPG`, capIkon: 'trending_up' },
    { label: 'Tenaga Kependidikan / TU', nilai: stats.tu, satuan: 'Staf Teknis', ikon: 'support_agent', box: 'bg-blue-50 text-blue-700', cap: 'Laboran, Pustakawan & IT', capIkon: 'work' },
  ]

  return (
    <section aria-label="Ringkasan staf" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {kartu.map((k) => (
        <div key={k.label} className="flex items-start justify-between gap-3 rounded-2xl border border-border-muted bg-surface-white p-5 shadow-sm">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{k.label}</p>
            <p className="mt-2 font-headline-lg text-headline-lg-mobile text-primary">
              {k.nilai} <span className="font-body-md text-body-md font-normal text-text-muted">{k.satuan}</span>
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-secondary">
              <Icon name={k.capIkon} className="text-[18px]" /> {k.cap}
            </p>
          </div>
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${k.box}`}>
            <Icon name={k.ikon} className="text-[24px]" />
          </span>
        </div>
      ))}

      <div className="flex items-start justify-between gap-3 rounded-2xl border border-border-muted bg-surface-white p-5 shadow-sm">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Status Akreditasi & Profil</p>
          <p className="mt-2 font-headline-lg text-headline-lg-mobile text-secondary">{akreditasi.nilai}</p>
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-on-surface-variant">
            <Icon name="school" className="text-[18px] text-secondary" /> {akreditasi.lembaga}
          </p>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cta-gold/30 text-primary">
          <Icon name="workspace_premium" className="text-[24px]" />
        </span>
      </div>
    </section>
  )
}
