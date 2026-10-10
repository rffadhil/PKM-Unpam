import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'

export default function AgendaTerdekat({ items }) {
  return (
    <section className="bg-surface-white border border-border-muted rounded-xl p-5 shadow-sm" aria-label="Agenda kampus terdekat">
      <div className="flex items-center justify-between pb-3 border-b border-border-muted">
        <div className="flex items-center gap-2">
          <Icon name="event" className="text-secondary text-lg" />
          <h3 className="font-headline-sm text-sm text-on-surface">Agenda Kampus Terdekat</h3>
        </div>
        <span className="text-[11px] font-label-sm font-bold px-2 py-0.5 bg-secondary/10 text-secondary rounded-full">
          {items.length} Acara
        </span>
      </div>
      <ul className="space-y-3 mt-4">
        {items.map((a) => (
          <li
            key={a.id}
            className="flex items-start gap-3 p-2.5 rounded-lg border border-border-muted hover:border-secondary/30 transition-all bg-surface-light/50"
          >
            <div className="bg-primary-container text-white rounded-md text-center w-11 shrink-0 overflow-hidden">
              <div className={`text-[9px] font-bold py-0.5 tracking-wider ${a.warnaBulan}`}>{a.bulan}</div>
              <div className="text-base font-bold py-1 leading-none font-headline-sm">{a.tanggal}</div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-label-lg font-bold text-on-surface truncate leading-tight">{a.judul}</h4>
              <p className="text-[11px] font-body-sm text-text-muted mt-1 flex items-center gap-1">
                <Icon name={a.ikon} className="text-xs" />
                {a.info}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <Link
        to="/admin/agenda"
        className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 px-3 border border-border-muted rounded-lg text-xs font-label-lg font-bold text-secondary hover:bg-secondary/5 transition-colors"
      >
        Kelola Semua Agenda
        <Icon name="arrow_forward" className="text-sm" />
      </Link>
    </section>
  )
}
