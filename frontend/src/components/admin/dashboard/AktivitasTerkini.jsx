import { Link } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '@/components/ui/Icon'

const TONE_IKON = {
  hijau: 'bg-emerald-100 text-secondary',
  biru: 'bg-blue-100 text-blue-700',
  merah: 'bg-red-100 text-error',
  kuning: 'bg-amber-100 text-amber-800',
}

export default function AktivitasTerkini({ items }) {
  return (
    <section className="bg-surface-white border border-border-muted rounded-xl p-6 shadow-sm" aria-label="Aktivitas publikasi dan log sistem">
      <div className="flex items-center justify-between pb-4 border-b border-border-muted gap-3">
        <div>
          <h3 className="font-headline-sm text-base text-on-surface">Aktivitas Publikasi &amp; Log Sistem Terkini</h3>
          <p className="text-xs font-body-sm text-text-muted mt-0.5">
            Audit jejak digital editor, staf kehumasan, dan sistem otomatis
          </p>
        </div>
        <Link
          to="/admin/log"
          className="text-xs font-label-sm font-bold text-secondary hover:underline flex items-center gap-1 shrink-0"
        >
          Lihat Semua Log
          <Icon name="arrow_forward" className="text-sm" />
        </Link>
      </div>

      <ul className="divide-y divide-border-muted mt-2">
        {items.map((a) => (
          <li
            key={a.id}
            className="py-3.5 flex items-start gap-3.5 hover:bg-surface-light/60 p-2 rounded-lg transition-colors"
          >
            <div
              className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                TONE_IKON[a.tone],
              )}
            >
              <Icon name={a.ikon} className="text-base" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-label-lg font-bold text-on-surface truncate">
                  {a.judul}
                  <span className={clsx('font-semibold', a.sorotClass)}>{a.sorot}</span>
                </p>
                <span className="text-[11px] font-body-sm text-text-muted shrink-0">{a.waktu}</span>
              </div>
              <p className="text-xs font-body-sm text-text-muted mt-0.5">
                {a.detail.map((d, i) => (
                  <span
                    key={i}
                    className={clsx(d.tebal && 'font-medium text-on-surface', d.kelas)}
                  >
                    {d.teks}
                  </span>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
