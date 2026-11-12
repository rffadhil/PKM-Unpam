import { Link } from 'react-router-dom'
import SectionHeading from '@/components/ui/SectionHeading'
import Icon from '@/components/ui/Icon'

// Perwakilan ekskul di Beranda (3 teratas). Data: mocks/home.js -> ekskulUnggulan.
export default function Ekskul({ items }) {
  return (
    <section className="py-16 bg-primary-container text-surface-container-lowest relative overflow-hidden">
      <div className="absolute inset-0 custom-pattern opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto mb-12">
          <SectionHeading
            tone="dark"
            align="center"
            eyebrow="Bakat, Minat & Karakter"
            title="Ekstrakurikuler Unggulan SMA Harapan Jaya"
          />
          <p className="text-center font-body-md text-surface-container-low mt-2">
            Wadah siswa mengembangkan minat, bakat, dan karakter di luar kelas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.slice(0, 3).map((e) => (
            <article
              key={e.id}
              className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden transition-all duration-200 hover:-translate-y-1.5 hover:bg-white/10"
            >
              <div className="h-56 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={e.foto}
                  alt={e.alt}
                  loading="lazy"
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-lg font-bold text-surface-white font-headline-sm">
                  {e.nama}
                </h3>
                <p className="text-body-sm text-surface-container-low/80 mt-1">
                  Pembina: {e.pembina}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            to="/profil#ekskul"
            className="text-cta-gold font-bold text-body-sm inline-flex items-center gap-1 hover:underline"
          >
            Lihat ekskul lainnya
            <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>
      </div>
    </section>
  )
}