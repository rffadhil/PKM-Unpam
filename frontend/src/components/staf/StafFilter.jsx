import Icon from '@/components/ui/Icon'
import { RUMPUN_PTK, STATUS_PEGAWAI } from '@/config/stafAdmin'

const kolom =
  'w-full rounded-xl border border-border-muted bg-surface-white py-2.5 text-sm text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20'

// Baris filter: cari, rumpun, status kepegawaian, reset.
export default function StafFilter({ nilai, onUbah, onReset, adaFilter }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-muted">
          <Icon name="search" className="text-[20px]" />
        </span>
        <input
          type="search"
          value={nilai.kata}
          onChange={(e) => onUbah({ ...nilai, kata: e.target.value })}
          placeholder="Cari nama, NIP, atau mata pelajaran..."
          aria-label="Cari PTK"
          className={`${kolom} pl-10 pr-3`}
        />
      </div>
      <select
        value={nilai.rumpun}
        onChange={(e) => onUbah({ ...nilai, rumpun: e.target.value })}
        aria-label="Filter rumpun pendidik"
        className={`${kolom} px-3.5`}
      >
        <option value="">Semua Rumpun Pendidik</option>
        {RUMPUN_PTK.map((r) => <option key={r}>{r}</option>)}
      </select>
      <select
        value={nilai.status}
        onChange={(e) => onUbah({ ...nilai, status: e.target.value })}
        aria-label="Filter status kepegawaian"
        className={`${kolom} px-3.5`}
      >
        <option value="">Semua Status Kepegawaian</option>
        {STATUS_PEGAWAI.map((s) => <option key={s.nilai} value={s.nilai}>{s.label}</option>)}
      </select>
      <button
        type="button"
        onClick={onReset}
        disabled={!adaFilter}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-muted bg-surface-white px-4 py-2.5 text-sm font-semibold text-text-muted transition-colors hover:bg-surface-light hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Icon name="filter_alt_off" className="text-[18px]" />
        Reset Filter
      </button>
    </div>
  )
}
