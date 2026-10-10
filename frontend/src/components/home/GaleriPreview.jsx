import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import SectionHeading from '@/components/ui/SectionHeading'

export default function GaleriPreview({ data }) {
  return (
    <section id="galeri" className="py-16 max-w-7xl mx-auto px-4 lg:px-8 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <SectionHeading eyebrow="Aktivitas & Kreativitas" title="Galeri Kegiatan Siswa" />
        <Link
          to="/galeri"
          className="px-5 py-2.5 bg-secondary text-surface-white font-semibold rounded-lg hover:bg-primary transition-all text-body-sm inline-flex items-center gap-2"
        >
          <span>Lihat Galeri Lengkap ({data.totalFoto} Foto)</span>
          <Icon name="photo_library" className="text-[18px]" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.foto.map((f) => (
          <div
            key={f.id}
            className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-surface-container shadow-sm border border-border-muted"
          >
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={f.gambar}
              alt={f.alt}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
              <span className="text-cta-gold font-bold text-xs uppercase tracking-wider">
                {f.kategori}
              </span>
              <h4 className="text-surface-white font-bold text-title-md">{f.judul}</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
