import Icon from '@/components/ui/Icon'
import { FILTER_TIKET_AWAL, KATEGORI_TIKET } from '@/config/pesanAdmin'

const kolom =
  'rounded-xl border border-border-muted bg-surface-white py-2 pl-3 pr-9 text-sm text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20'
const tanggal = 'border-0 bg-transparent p-0 text-sm text-on-surface focus:ring-0'

// Kartu filter: kategori layanan + rentang tanggal + reset.
export default function PesanToolbar({ nilai, onUbah }) {
  const adaFilter = Boolean(nilai.kategori || nilai.dari || nilai.sampai)
  return (
    <section className="rounded-2xl border border-border-muted bg-surface-white px-6 py-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
          <Icon name="filter_alt" className="text-[18px] text-text-muted" />
          Filter:
        </span>

        <select
          value={nilai.kategori}
          onChange={(e) => onUbah({ ...nilai, kategori: e.target.value })}
          aria-label="Filter kategori layanan"
          className={kolom}
        >
          <option value="">Semua Kategori Layanan</option>
          {KATEGORI_TIKET.map((k) => <option key={k.kunci} value={k.kunci}>{k.label}</option>)}
        </select>

        <div className="inline-flex items-center gap-2 rounded-xl border border-border-muted bg-surface-white px-3 py-2 text-sm">
          <Icon name="calendar_today" className="text-[18px] text-text-muted" />
          <input
            type="date"
            value={nilai.dari}
            max={nilai.sampai || undefined}
            onChange={(e) => onUbah({ ...nilai, dari: e.target.value })}
            aria-label="Dari tanggal"
            className={tanggal}
          />
          <span aria-hidden="true" className="text-text-muted">-</span>
          <input
            type="date"
            value={nilai.sampai}
            min={nilai.dari || undefined}
            onChange={(e) => onUbah({ ...nilai, sampai: e.target.value })}
            aria-label="Sampai tanggal"
            className={tanggal}
          />
        </div>

        <button
          type="button"
          onClick={() => onUbah(FILTER_TIKET_AWAL)}
          disabled={!adaFilter}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface-light hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="restart_alt" className="text-[18px]" />
          Reset Filter
        </button>
      </div>
    </section>
  )
}
