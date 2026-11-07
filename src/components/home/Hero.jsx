import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'

// Carousel manual (tanpa autoplay). `slides` = highlight dari CMS (PRD: 3–5 slide).
export default function Hero({ slides }) {
  const [indeks, setIndeks] = useState(0)
  const slide = slides[indeks]
  const nomor = String(indeks + 1).padStart(2, '0')

  const sebelumnya = () => setIndeks((i) => (i - 1 + slides.length) % slides.length)
  const berikutnya = () => setIndeks((i) => (i + 1) % slides.length)

  return (
    <section className="relative bg-primary-container overflow-hidden text-surface-container-lowest">
      <div className="absolute inset-0 opacity-15 custom-pattern" />
      <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-surface-container-lowest border border-white/20 text-label-sm font-label-sm">
              <Icon name="eco" filled className="text-[16px] text-cta-gold" />
              Sekolah Adiwiyata Mandiri Terakreditasi Unggul (A)
            </div>
            <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-surface-white font-bold tracking-tight">
              Membentuk Generasi Unggul, Berkarakter Pancasila, dan Berwawasan Lingkungan Global
            </h1>
            <p className="font-body-lg text-body-lg text-surface-container-low max-w-2xl">
              SMA Harapan Jaya memadukan keunggulan akademik Kurikulum Merdeka, pembinaan
              kecerdasan digital terpadu, dan habituasi kepedulian lingkungan hidup yang inklusif
              bagi seluruh peserta didik.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <Link
                to="/ppdb"
                className="px-6 py-3.5 bg-cta-gold text-primary font-bold rounded-lg shadow-md hover:bg-[#dcd000] transition-all duration-200 active:scale-95 text-label-lg font-label-lg flex items-center gap-2"
              >
                <Icon name="assignment_ind" />
                Informasi PPDB 2026/2027
              </Link>
              <Link
                to="/profil"
                className="px-6 py-3.5 bg-transparent border-2 border-surface-white text-surface-white font-semibold rounded-lg hover:bg-surface-white/10 transition-all duration-200 active:scale-95 text-label-lg font-label-lg flex items-center gap-2"
              >
                <span>Jelajahi Profil Sekolah</span>
                <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
            </div>

            {/* Indikator slide */}
            <div className="flex items-center gap-3 pt-6 text-body-sm font-body-sm text-surface-container-low">
              <span className="flex items-center gap-1 font-bold text-cta-gold">
                <span className="w-8 h-1.5 bg-cta-gold rounded-full" />
                Slide {nomor}
              </span>
              <span className="text-surface-container-low/50">/</span>
              <span aria-live="polite">{slide.label}</span>
              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Slide sebelumnya"
                  onClick={sebelumnya}
                  className="p-1 rounded hover:bg-white/10 text-white"
                >
                  <Icon name="chevron_left" className="text-[20px]" />
                </button>
                <button
                  type="button"
                  aria-label="Slide berikutnya"
                  onClick={berikutnya}
                  className="p-1 rounded hover:bg-white/10 text-white"
                >
                  <Icon name="chevron_right" className="text-[20px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Kartu visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-surface-white/20 bg-secondary/40 aspect-[4/3] group">
              <img
                key={slide.id}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={slide.gambar}
                alt={slide.alt}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-surface-white/95 backdrop-blur-md p-4 rounded-xl border border-white text-on-surface shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-container text-cta-gold flex items-center justify-center">
                      <Icon name={slide.ikon} />
                    </div>
                    <div>
                      <h4 className="font-headline-sm text-sm font-bold text-primary">{slide.judul}</h4>
                      <p className="font-body-sm text-[12px] text-text-muted">{slide.keterangan}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-secondary-container text-on-secondary-container font-bold text-xs rounded-full">
                    {slide.badge}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
