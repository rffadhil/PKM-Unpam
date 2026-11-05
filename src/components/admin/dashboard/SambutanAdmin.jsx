import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { formatTanggalPanjang, isoTanggal, tahunPelajaran } from '@/utils/overview'

// Kartu sambutan: tahun pelajaran, tanggal, catatan sistem, dan dua aksi cepat.
export default function SambutanAdmin({ nama, catatan, tanggal = new Date() }) {
  return (
    <section
      aria-label="Sambutan"
      className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm"
    >
      <div className="min-w-0 max-w-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-md border border-secondary/30 bg-secondary-container/40 px-2.5 py-1 text-[12px] font-bold uppercase text-secondary-dark">
            Tahun Pelajaran {tahunPelajaran(tanggal)}
          </span>
          <span aria-hidden="true" className="text-text-muted">•</span>
          <span className="inline-flex items-center gap-1.5 text-body-sm text-text-muted">
            <Icon name="calendar_today" className="text-[18px]" />
            <time dateTime={isoTanggal(tanggal)}>{formatTanggalPanjang(tanggal)}</time>
          </span>
        </div>
        <h2 className="mt-3 font-headline-md text-[28px] font-bold leading-9 text-primary-container">
          Selamat Datang kembali, {nama}!
        </h2>
        <p className="mt-1 text-body-md text-text-muted">{catatan}</p>
      </div>

      <div className="flex flex-col gap-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-secondary px-5 py-2.5 font-semibold text-secondary transition-colors hover:bg-secondary-container/30"
        >
          Lihat Portal Publik <Icon name="open_in_new" className="text-[20px]" />
        </a>
        <Link
          to="/admin/berita/baru"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-cta-gold px-5 py-2.5 font-bold text-primary shadow-sm transition hover:brightness-95"
        >
          <Icon name="add_circle" className="text-[22px]" /> Publikasi Cepat
        </Link>
      </div>
    </section>
  )
}
