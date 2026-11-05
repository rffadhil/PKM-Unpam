import { Link } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '@/components/ui/Icon'

// `items` = pesan terbaru yang ditampilkan; `jumlah` = total pesan yang menunggu.
export default function PesanBelumDiproses({ items, jumlah }) {
  return (
    <section className="bg-surface-white border border-border-muted rounded-xl p-5 shadow-sm" aria-label="Pesan masuk belum diproses">
      <div className="flex items-center justify-between pb-3 border-b border-border-muted">
        <div className="flex items-center gap-2">
          <Icon name="mark_email_unread" className="text-error text-lg" />
          <h3 className="font-headline-sm text-sm text-on-surface">Pesan Masuk Belum Diproses</h3>
        </div>
        <span className="bg-red-100 text-error text-[10px] font-label-sm font-bold px-2 py-0.5 rounded-full">
          {jumlah} Menunggu
        </span>
      </div>

      <ul className="space-y-3 mt-4">
        {items.map((p) => (
          <li
            key={p.id}
            className={clsx(
              'p-3 rounded-lg border space-y-2',
              p.mendesak ? 'border-red-100 bg-red-50/30' : 'border-border-muted bg-surface-light/40',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-label-lg font-bold text-on-surface">{p.pengirim}</span>
              <span className="text-[10px] font-body-sm text-text-muted shrink-0">{p.waktu}</span>
            </div>
            <p className="text-xs font-body-sm text-text-muted line-clamp-2 italic">“{p.isi}”</p>
            <div className="flex items-center justify-between pt-1 gap-2">
              <span
                className={clsx(
                  'text-[10px] font-label-sm font-semibold',
                  p.mendesak ? 'text-secondary' : 'text-amber-700',
                )}
              >
                {p.kotak}
              </span>
              <Link
                to={`/admin/pesan?id=${p.id}`}
                aria-label={`Balas pesan dari ${p.pengirim}`}
                className={clsx(
                  'px-2.5 py-1 text-[11px] font-label-sm font-semibold rounded transition-all flex items-center gap-1',
                  p.mendesak
                    ? 'bg-secondary text-white hover:bg-secondary/90'
                    : 'bg-surface-white border border-border-muted hover:border-secondary text-on-surface',
                )}
              >
                <Icon name="reply" className="text-xs" />
                Balas
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <Link
        to="/admin/pesan"
        className="w-full mt-4 flex items-center justify-center gap-1 py-1.5 text-xs font-label-sm text-text-muted hover:text-on-surface font-semibold"
      >
        Buka Kotak Pesan Masuk Lengkap
        <Icon name="chevron_right" className="text-xs" />
      </Link>
    </section>
  )
}
