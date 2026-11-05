import Icon from '@/components/ui/Icon'

// Kartu judul katalog + tombol buat album baru.
export default function GaleriHeader({ onTambah }) {
  return (
    <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2 className="text-headline-sm font-bold text-primary md:text-2xl">Katalog Dokumentasi Multimedia Sekolah</h2>
          <p className="mt-1.5 text-body-md text-text-muted">
            Kelola koleksi foto dokumentasi prestasi, kurikulum Adiwiyata, dan kegiatan ekstrakurikuler resmi.
          </p>
        </div>
        <button
          type="button"
          onClick={onTambah}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-cta-gold px-6 py-3 text-sm font-bold text-primary shadow-sm transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon name="add_circle" className="text-[22px]" />
          Buat Album Baru &amp; Upload Foto
        </button>
      </div>
    </section>
  )
}
