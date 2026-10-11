import Icon from '@/components/ui/Icon'
import { KATEGORI_GALERI, STATUS_ALBUM, URUTAN_ALBUM } from '@/config/galeri'

const selectCls = 'rounded-xl border border-border-muted bg-surface-white px-4 py-2.5 text-sm text-primary focus:border-secondary focus:ring-secondary'

// Header katalog: judul, 3 tombol aksi, tab kategori, dan filter (langsung berlaku, tanpa tombol terapkan).
export default function GaleriToolbar({
  totalAlbum,
  hitungKategori,
  kategori,
  onKategori,
  filter,
  onFilter,
  onBuatAlbum,
  onVideo,
  onKompresi,
}) {
  const tab = (nilai, label, jumlah) => {
    const aktif = kategori === nilai
    return (
      <button
        key={nilai || 'semua'}
        type="button"
        aria-pressed={aktif}
        onClick={() => onKategori(nilai)}
        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
          aktif ? 'bg-primary-container text-white' : 'bg-surface-light text-on-surface-variant hover:bg-surface-container'
        }`}
      >
        {label} ({jumlah})
      </button>
    )
  }

  return (
    <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <h2 className="flex items-center gap-3 text-headline-sm font-bold text-primary">
            <Icon name="perm_media" className="text-[28px] text-secondary" /> Katalog Dokumentasi Multimedia Sekolah
          </h2>
          <p className="mt-1 text-text-muted">Kelola koleksi foto dokumentasi prestasi, kurikulum Adiwiyata, dan kegiatan ekstrakurikuler resmi.</p>
        </div>
        <div className="flex flex-col items-stretch gap-2.5 sm:items-start">
          <button onClick={onBuatAlbum} className="inline-flex items-center gap-2 rounded-xl bg-cta-gold px-4 py-2.5 font-bold text-primary shadow-sm hover:brightness-95">
            <Icon name="add_circle" /> Buat Album Baru & Upload Foto
          </button>
          <button onClick={onVideo} className="inline-flex items-center gap-2 rounded-xl bg-primary-container px-4 py-2.5 font-semibold text-white hover:bg-primary">
            <Icon name="smart_display" /> Kelola Video YouTube Stream
          </button>
          <button onClick={onKompresi} className="inline-flex items-center gap-2 rounded-xl border border-secondary px-4 py-2.5 font-semibold text-secondary hover:bg-secondary-container/30">
            <Icon name="compress" /> Optimasi Kompresi Gambar
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border-muted pt-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Kategori album">
          {tab('', 'Semua Album', totalAlbum)}
          {KATEGORI_GALERI.map((k) => tab(k, k, hitungKategori[k] ?? 0))}
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-3 lg:min-w-[28rem]">
          <div className="relative min-w-[12rem] flex-1">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              aria-label="Cari nama album"
              value={filter.kata}
              onChange={(e) => onFilter({ ...filter, kata: e.target.value })}
              placeholder="Cari nama album..."
              className={`${selectCls} w-full pl-10`}
            />
          </div>
          <select aria-label="Filter status" value={filter.status} onChange={(e) => onFilter({ ...filter, status: e.target.value })} className={selectCls}>
            <option value="">Semua Status (Tayang / Draft)</option>
            {Object.entries(STATUS_ALBUM).map(([k, s]) => (
              <option key={k} value={k}>
                {s.label}
              </option>
            ))}
          </select>
          <select aria-label="Urutan album" value={filter.urutan} onChange={(e) => onFilter({ ...filter, urutan: e.target.value })} className={selectCls}>
            {URUTAN_ALBUM.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}
