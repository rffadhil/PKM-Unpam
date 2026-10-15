import Icon from '@/components/ui/Icon'
import { kategoriBerita, statusBerita } from '@/config/kategoriBerita'
import { SEMUA } from '@/config/berita'

const selectClass =
  'text-body-sm font-body-sm bg-surface-white border border-border-muted rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-secondary focus:border-secondary text-on-surface'

// Bilah filter: nilai dropdown baru berlaku setelah tombol Filter ditekan (onTerapkan).
export default function BeritaFilter({ kategori, status, onKategori, onStatus, onTerapkan, jumlahTerpilih = 0 }) {
  return (
    <div className="p-4 bg-surface-light border-b border-border-muted flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="filter-kategori" className="font-label-sm text-label-sm text-text-muted">
            Kategori:
          </label>
          <select id="filter-kategori" className={selectClass} value={kategori} onChange={(e) => onKategori(e.target.value)}>
            <option value={SEMUA}>Semua Kategori</option>
            {kategoriBerita.map((k) => (
              <option key={k.nama} value={k.nama}>
                {k.nama}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="filter-status" className="font-label-sm text-label-sm text-text-muted">
            Status:
          </label>
          <select id="filter-status" className={selectClass} value={status} onChange={(e) => onStatus(e.target.value)}>
            <option value={SEMUA}>Semua Status</option>
            {statusBerita.map((s) => (
              <option key={s.nilai} value={s.nilai}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={onTerapkan}
          className="px-3.5 py-1.5 rounded-lg bg-primary-container text-surface-white font-label-sm text-label-sm hover:bg-secondary transition-colors inline-flex items-center gap-1"
        >
          <Icon name="filter_list" className="text-[16px]" />
          Filter
        </button>
      </div>
      <div className="flex items-center gap-3 text-text-muted text-xs">
        {jumlahTerpilih > 0 && <span className="font-semibold text-secondary">{jumlahTerpilih} dipilih</span>}
        <span>Urutkan:</span>
        <span className="font-semibold text-primary">Terbaru (Default)</span>
      </div>
    </div>
  )
}
