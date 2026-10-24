import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { NADA_IKON, NADA_TEKS } from '@/config/dashboard'

// Daftar aktivitas publikasi & log sistem. items: lihat mocks/dashboardOverview.js
export default function AktivitasTerkini({ items, linkSemua = '/admin/log' }) {
  return (
    <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border-muted pb-4">
        <div>
          <h2 className="text-headline-sm font-bold text-primary-container">Aktivitas Publikasi & Log Sistem Terkini</h2>
          <p className="text-body-sm text-text-muted">Audit jejak digital editor, staf kehumasan, dan sistem otomatis</p>
        </div>
        <Link to={linkSemua} className="inline-flex items-center gap-1.5 text-label-lg font-bold text-secondary hover:underline">
          Lihat Semua Log <Icon name="arrow_forward" className="text-[20px]" />
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="py-10 text-center text-text-muted">Belum ada aktivitas tercatat.</p>
      ) : (
        <ul className="divide-y divide-border-muted">
          {items.map((a) => (
            <li key={a.id} className="flex items-start gap-4 py-4">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${NADA_IKON[a.nada]}`}>
                <Icon name={a.ikon} className="text-[22px]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="text-body-md text-on-surface">
                    <span className="font-bold">{a.aktor}</span>{' '}
                    <span className="font-bold">{a.aksi}</span>{' '}
                    <span className={`font-semibold ${NADA_TEKS[a.objekNada] ?? ''}`}>{a.objek}</span>
                  </p>
                  <span className="shrink-0 text-body-sm text-text-muted">{a.waktu}</span>
                </div>
                <p className="mt-0.5 text-body-sm text-text-muted">
                  {a.meta.map((m, i) => (
                    <span key={i}>
                      {i > 0 && <span className="mx-1.5">•</span>}
                      {m.label && `${m.label}: `}
                      <span className={NADA_TEKS[m.tone] ?? ''}>{m.nilai}</span>
                    </span>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
