import Icon from '@/components/ui/Icon'
import { TAB_PROFIL } from '@/config/staf'

// Tab 4 bagian. Panel yang sesuai harus punya id="panel-<id>" dan aria-labelledby="tab-<id>".
export default function StafTabs({ aktif, onUbah, jumlahStaf }) {
  return (
    <div role="tablist" aria-label="Bagian profil sekolah" className="flex flex-wrap gap-x-8 gap-y-1 border-b border-border-muted">
      {TAB_PROFIL.map((t) => {
        const dipilih = aktif === t.id
        return (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={dipilih}
            aria-controls={`panel-${t.id}`}
            onClick={() => onUbah(t.id)}
            className={`-mb-px inline-flex items-center gap-2 border-b-2 px-1 py-4 text-[15px] font-semibold transition-colors ${
              dipilih ? 'border-secondary text-secondary' : 'border-transparent text-text-muted hover:text-primary'
            }`}
          >
            <Icon name={t.ikon} className="text-[20px]" /> {t.label}
            {t.hitung && <span className="rounded-full bg-cta-gold px-2 py-0.5 text-xs font-bold text-primary">{jumlahStaf}</span>}
          </button>
        )
      })}
    </div>
  )
}
