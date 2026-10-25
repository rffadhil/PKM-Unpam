
import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'

// Judul daftar berita dan tombol Tambah Berita Baru.
export default function BeritaHeader() {
  return (
    <div className="p-5 border-b border-border-muted flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
          Daftar Artikel &amp; Publikasi Sekolah
        </h2>
        <p className="font-body-sm text-body-sm text-text-muted">
          Kelola berita utama, rilis pers, kalender acara, dan pengumuman resmi institusi.
        </p>
      </div>
      <Link
        to="/admin/berita/baru"
        className="inline-flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-lg bg-cta-gold text-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-[#D0D000] active:scale-95 transition-all"
      >
        <Icon name="add_circle" className="text-[20px]" />
        Tambah Berita Baru
      </Link>
    </div>
  )
}
