import Icon from '@/components/ui/Icon'
import { KATEGORI_DOKUMEN, STATUS_DOKUMEN } from '@/config/dokumenAdmin'

const pilih =
  'rounded-lg border border-border-muted bg-surface-white py-2 pl-3 pr-9 text-sm text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20'

// Filter kategori + status, dan tombol muat ulang.
export default function DokumenFilter({ nilai, onUbah, onMuat }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2 text-sm text-text-muted">
        Kategori:
        <select value={nilai.kategori} onChange={(e) => onUbah({ ...nilai, kategori: e.target.value })} className={pilih}>
          <option value="">Semua Kategori</option>
          {KATEGORI_DOKUMEN.map((k) => <option key={k}>{k}</option>)}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm text-text-muted">
        Status:
        <select value={nilai.status} onChange={(e) => onUbah({ ...nilai, status: e.target.value })} className={pilih}>
          <option value="">Semua Status</option>
          {STATUS_DOKUMEN.map((s) => <option key={s.nilai} value={s.nilai}>{s.label}</option>)}
        </select>
      </label>
      <button
        type="button"
        onClick={onMuat}
        aria-label="Muat ulang daftar dokumen"
        className="rounded-lg border border-border-muted bg-surface-white p-2 text-text-muted transition-colors hover:bg-surface-light hover:text-primary"
      >
        <Icon name="refresh" className="text-[20px]" />
      </button>
    </div>
  )
}
