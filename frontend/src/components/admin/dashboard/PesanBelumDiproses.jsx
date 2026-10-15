import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { NADA_TEKS } from '@/config/dashboard'

// Pesan yang belum dibalas. items: lihat mocks/dashboardOverview.js
export default function PesanBelumDiproses({ items }) {
  return (
    <section className="rounded-2xl border border-border-muted bg-surface-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border-muted pb-4">
        <h2 className="flex items-center gap-2.5 text-title-md font-bold text-primary-container">
          <Icon name="mark_email_unread" className="text-[24px] text-error" />
          Pesan Masuk Belum Diproses
        </h2>
        <span className="shrink-0 rounded-full bg-error-container px-3 py-1 text-[12px] font-bold text-on-error-container">
          {items.length} Menunggu
        </span>
      </div>

      {items.length === 0 ? (
        <p className="py-8 text-center text-text-muted">Semua pesan sudah diproses.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((p) => (
            <li
              key={p.id}
              className={`rounded-xl border p-4 ${p.baru ? 'border-error/20 bg-error-container/20' : 'border-border-muted bg-surface-white'}`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-body-md font-bold text-on-surface">{p.nama}</h3>
                <span className="shrink-0 text-[12px] text-text-muted">{p.waktu}</span>
              </div>
              <p className="mt-2 line-clamp-3 text-body-sm italic text-text-muted">&ldquo;{p.isi}&rdquo;</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className={`text-[12px] font-semibold ${NADA_TEKS[p.kategoriNada] ?? ''}`}>{p.kategori}</span>
                <Link
                  to="/admin/pesan"
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-label-lg font-semibold ${
                    p.baru
                      ? 'bg-secondary text-surface-white hover:brightness-110'
                      : 'border border-border-muted text-on-surface hover:bg-surface-light'
                  }`}
                >
                  <Icon name="reply" className="text-[20px]" /> Balas
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link to="/admin/pesan" className="mt-4 flex items-center justify-center gap-1 text-label-lg font-semibold text-on-surface hover:text-secondary">
        Buka Kotak Pesan Masuk Lengkap <Icon name="chevron_right" className="text-[20px]" />
      </Link>
    </section>
  )
}
