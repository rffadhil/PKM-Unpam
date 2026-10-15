import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'

const hariIni = () =>
  new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())

// Kartu sambutan: tahun pelajaran, tanggal, catatan sistem, dan dua aksi cepat.
export default function SambutanAdmin({ nama, tahunPelajaran, catatan }) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm">
      <div className="min-w-0 max-w-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-md border border-secondary/30 bg-secondary-container/40 px-2.5 py-1 text-[12px] font-bold uppercase text-secondary-dark">
            Tahun Pelajaran {tahunPelajaran}
          </span>
          <span className="inline-flex items-center gap-1.5 text-body-sm text-text-muted">
            <Icon name="calendar_today" className="text-[18px]" />
            {hariIni()}
          </span>
        </div>
        <h1 className="mt-3 font-headline-md text-headline-md font-bold text-primary-container">
          Selamat Datang kembali, {nama}!
        </h1>
        <p className="mt-1 text-body-md text-text-muted">{catatan}</p>
      </div>

      <div className="flex flex-col gap-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-secondary px-5 py-2.5 font-semibold text-secondary hover:bg-secondary-container/30"
        >
          Lihat Portal Publik <Icon name="open_in_new" className="text-[20px]" />
        </a>
        <Link
          to="/admin/berita/baru"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-cta-gold px-5 py-2.5 font-bold text-primary shadow-sm hover:brightness-95"
        >
          <Icon name="add_circle" className="text-[22px]" /> Publikasi Cepat
        </Link>
      </div>
    </section>
  )
}
