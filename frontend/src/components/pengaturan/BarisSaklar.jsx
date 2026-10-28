import Icon from '@/components/ui/Icon'
import Saklar from '@/components/ui/Saklar'

// Satu baris pengaturan on/off: ikon, judul + status, deskripsi, saklar.
export default function BarisSaklar({ ikon, judul, deskripsi, aktif, onUbah, sorotSaatAktif = false }) {
  const sorot = aktif && sorotSaatAktif
  return (
    <div className={`flex items-start gap-4 rounded-xl border p-5 ${sorot ? 'border-secondary/40 bg-secondary-container/20' : 'border-border-muted bg-surface-light/60'}`}>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${sorot ? 'bg-secondary-container text-secondary' : 'bg-surface-container-high text-text-muted'}`}>
        <Icon name={ikon} className="text-[22px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-primary">{judul}</h3>
          <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${aktif ? 'bg-secondary-container text-on-secondary-fixed-variant' : 'bg-surface-container-high text-text-muted'}`}>
            Status: {aktif ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>
        <p className="mt-1 text-body-sm text-text-muted">{deskripsi}</p>
      </div>
      <Saklar aktif={aktif} onUbah={onUbah} label={judul} />
    </div>
  )
}
