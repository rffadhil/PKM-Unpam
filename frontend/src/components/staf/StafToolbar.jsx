import Icon from '@/components/ui/Icon'
import { RUMPUN_STAF, STATUS_KEPEGAWAIAN } from '@/config/staf'

const fieldCls = 'w-full rounded-xl border border-border-muted bg-surface-white px-4 py-2.5 text-sm text-primary focus:border-secondary focus:ring-secondary'

// Tombol aksi + filter (langsung berlaku). Tombol Reset mengembalikan semua filter.
export default function StafToolbar({ filter, onFilter, onReset, onTambah, onEkspor, onDapodik }) {
  return (
    <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onTambah} className="inline-flex items-center gap-2 rounded-xl bg-cta-gold px-5 py-3 font-bold text-primary shadow-sm hover:brightness-95">
          <Icon name="person_add" /> Tambah Pendidik / Staf Baru
        </button>
        <div className="flex flex-wrap gap-3">
          <button onClick={onEkspor} className="inline-flex items-center gap-2 rounded-xl bg-secondary-dark px-4 py-2.5 font-semibold text-white hover:bg-primary-container">
            <Icon name="download" className="text-[18px]" /> Ekspor Data PTK (.CSV)
          </button>
          <button onClick={onDapodik} className="inline-flex items-center gap-2 rounded-xl border border-secondary px-4 py-2.5 font-semibold text-secondary hover:bg-secondary-container/30">
            <Icon name="sync" className="text-[18px]" /> Tarik Data Dapodik
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-border-muted pt-5 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
        <div className="relative">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            aria-label="Cari staf"
            value={filter.kata}
            onChange={(e) => onFilter({ ...filter, kata: e.target.value })}
            placeholder="Cari nama, NIP, atau mata pelajaran..."
            className={`${fieldCls} pl-10`}
          />
        </div>
        <select aria-label="Filter rumpun pendidik" value={filter.rumpun} onChange={(e) => onFilter({ ...filter, rumpun: e.target.value })} className={fieldCls}>
          <option value="">Semua Rumpun Pendidik</option>
          {RUMPUN_STAF.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <select aria-label="Filter status kepegawaian" value={filter.status} onChange={(e) => onFilter({ ...filter, status: e.target.value })} className={fieldCls}>
          <option value="">Semua Status Kepegawaian</option>
          {Object.entries(STATUS_KEPEGAWAIAN).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
        <button onClick={onReset} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-muted px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-light">
          <Icon name="filter_alt_off" className="text-[18px]" /> Reset Filter
        </button>
      </div>
    </section>
  )
}
