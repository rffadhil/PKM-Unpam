import Icon from '@/components/ui/Icon'

// Banner hijau di bawah tabel. Tombol broadcast dikendalikan halaman (butuh backend).
export default function AgendaSyncBanner({ onBroadcast, hrefPublik = '/agenda-galeri' }) {
  return (
    <section className="flex flex-wrap items-center gap-5 rounded-2xl bg-primary-container p-6 text-white shadow-sm">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-secondary/50 text-tertiary-fixed">
        <Icon name="sync_alt" className="text-[28px]" />
      </span>
      <div className="min-w-0 flex-1 basis-80">
        <h2 className="text-headline-sm font-bold">Sinkronisasi Otomatis Portal Publik & Siaran Notifikasi Wali Murid</h2>
        <p className="mt-1 text-sm text-white/75">
          Setiap agenda berstatus <span className="font-semibold text-tertiary-fixed">Mendatang</span> dan{' '}
          <span className="font-semibold text-tertiary-fixed">Penting / Wajib</span> otomatis dipublikasikan pada laman Agenda Publik dan dijadwalkan ke kalender SIS e-learning siswa.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <a
          href={hrefPublik}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/20"
        >
          <Icon name="open_in_new" className="text-[18px]" /> Cek Tampilan Publik
        </a>
        <button onClick={onBroadcast} className="rounded-lg bg-cta-gold px-4 py-2.5 text-sm font-bold text-primary hover:brightness-95">
          Kirim Notifikasi Broadcast
        </button>
      </div>
    </section>
  )
}
