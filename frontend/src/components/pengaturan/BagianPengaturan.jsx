import Icon from '@/components/ui/Icon'

// Cangkang satu bagian pengaturan: ikon + judul + subjudul + slot kanan (lencana/tombol).
export default function BagianPengaturan({ ikon, judul, subjudul, aksi, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border-muted bg-surface-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border-muted bg-surface-light/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary-container text-secondary">
            <Icon name={ikon} className="text-[20px]" />
          </span>
          <div>
            <h2 className="text-lg font-bold leading-tight text-primary">{judul}</h2>
            <p className="text-body-sm text-text-muted">{subjudul}</p>
          </div>
        </div>
        {aksi}
      </header>
      <div className="p-6">{children}</div>
    </section>
  )
}
