import Icon from '@/components/ui/Icon'
import { KATEGORI_PESAN, STATUS_PESAN } from '@/config/pesan'

const fieldCls = 'rounded-xl border border-border-muted bg-surface-white px-3 py-2 text-sm text-primary focus:border-secondary focus:ring-secondary'

export default function PesanToolbar({ filter, onFilter, onReset, onBuat, onEkspor, onSinkron, sinkronTerakhir }) {
  return (
    <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <button onClick={onBuat} className="inline-flex items-center gap-2 rounded-xl bg-cta-gold px-4 py-2.5 font-bold text-primary shadow-sm hover:brightness-95">
            <Icon name="add_circle" /> Buat Tiket / Catat Pesan Baru
          </button>
          <button onClick={onEkspor} className="inline-flex items-center gap-2 rounded-xl bg-secondary-dark px-4 py-2.5 font-semibold text-white hover:bg-primary-container">
            <Icon name="download" className="text-[18px]" /> Ekspor Rekap (.CSV)
          </button>
          <button onClick={onSinkron} className="inline-flex items-center gap-2 rounded-xl border border-secondary px-4 py-2.5 font-semibold text-secondary hover:bg-secondary-container/30">
            <Icon name="sync" className="text-[18px]" /> Sinkronkan PTSP Online
          </button>
        </div>
        <p className="flex items-center gap-2 text-sm text-text-muted">
          <span className="h-2.5 w-2.5 rounded-full bg-secondary" /> Sinkronisasi Otomatis Terakhir: <strong className="text-primary">{sinkronTerakhir}</strong>
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border-muted pt-5">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant">
          <Icon name="filter_list" className="text-[18px]" /> Filter:
        </span>
        <select aria-label="Filter kategori layanan" value={filter.kategori} onChange={(e) => onFilter({ ...filter, kategori: e.target.value })} className={fieldCls}>
          <option value="">Semua Kategori Layanan</option>
          {KATEGORI_PESAN.map((k) => <option key={k.kunci} value={k.kunci}>{k.label}</option>)}
        </select>
        <select aria-label="Filter status respon" value={filter.status} onChange={(e) => onFilter({ ...filter, status: e.target.value })} className={fieldCls}>
          <option value="">Semua Status Respon</option>
          {Object.entries(STATUS_PESAN).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
        </select>
        <div className="flex items-center gap-2 rounded-xl border border-border-muted bg-surface-white px-3 py-1.5 text-sm text-primary">
          <Icon name="calendar_month" className="text-[18px] text-text-muted" />
          <input type="date" aria-label="Tanggal mulai" value={filter.dari} max={filter.sampai || undefined} onChange={(e) => onFilter({ ...filter, dari: e.target.value })} className="border-0 bg-transparent p-0 text-sm focus:ring-0" />
          <span aria-hidden>–</span>
          <input type="date" aria-label="Tanggal akhir" value={filter.sampai} min={filter.dari || undefined} onChange={(e) => onFilter({ ...filter, sampai: e.target.value })} className="border-0 bg-transparent p-0 text-sm focus:ring-0" />
        </div>
        <button onClick={onReset} className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-primary">
          <Icon name="restart_alt" className="text-[18px]" /> Reset Filter
        </button>
      </div>
    </section>
  )
}
