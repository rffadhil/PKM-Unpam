import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { formatTanggalPanjang, tahunPelajaran } from '@/utils/tanggal'

// Kartu sambutan di puncak Overview. `tanggal` (Date) dikirim dari halaman agar render tetap murni.
export default function SambutanAdmin({ nama, status, tanggal }) {
  return (
    <section
      aria-label="Sambutan"
      className="bg-surface-white border border-border-muted rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden"
    >
      <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-primary-container/5 rounded-full blur-2xl pointer-events-none" />
      <div className="space-y-1 relative">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-label-sm font-bold bg-secondary/10 text-secondary border border-secondary/20 uppercase">
            Tahun Pelajaran {tahunPelajaran(tanggal)}
          </span>
          <span aria-hidden="true" className="text-xs text-text-muted">•</span>
          <span className="text-xs font-body-sm text-text-muted flex items-center gap-1">
            <Icon name="calendar_today" className="text-sm" />
            {formatTanggalPanjang(tanggal)}
          </span>
        </div>
        <h2 className="font-headline-md text-2xl text-primary font-bold">Selamat Datang kembali, {nama}!</h2>
        <p className="text-text-muted font-body-sm text-sm">{status}</p>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto relative">
        <Link
          to="/admin/berita/baru"
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-cta-gold hover:bg-[#d4d400] text-primary font-label-lg text-xs font-bold rounded-full shadow-sm hover:shadow transition-all duration-150 active:scale-95"
        >
          <Icon name="add_circle" className="text-base" />
          Publikasi Cepat
        </Link>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-white border border-secondary text-secondary hover:bg-secondary/5 font-label-lg text-xs font-bold rounded-full transition-all duration-150 active:scale-95 shadow-sm"
        >
          Lihat Portal Publik
          <Icon name="open_in_new" className="text-base" />
        </a>
      </div>
    </section>
  )
}
