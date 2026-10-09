import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { site } from '@/config/site'
import { footerPenting, footerLayanan, footerBawah } from '@/config/navigation'
import { petaFooter } from '@/mocks/home'

const linkBiasa = 'text-surface-container-low hover:text-cta-gold transition-colors flex items-center gap-1.5'

// Tautan yang bisa internal (to) atau biasa/eksternal (href)
function FooterLink({ item, className, children }) {
  if (item.to) {
    return (
      <Link to={item.to} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <a href={item.href} className={className}>
      {children}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-primary-container text-surface-container-lowest border-t border-secondary">
      <div className="w-full py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Kolom 1: identitas */}
          <div className="space-y-4">
            <div>
              <span className="font-headline-sm text-headline-sm font-bold text-surface-container-lowest block leading-tight">
                {site.nama}
              </span>
              <span className="text-[11px] text-cta-gold font-bold">{site.sebutan}</span>
            </div>
            <p className="font-body-sm text-body-sm text-surface-container-low opacity-90 leading-relaxed">
              {site.deskripsi}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/10 px-2.5 py-1 rounded text-surface-white border border-white/10">
                <Icon name="verified" className="text-[14px] text-cta-gold" />
                {site.akreditasiSingkat}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/10 px-2.5 py-1 rounded text-surface-white border border-white/10">
                <Icon name="eco" className="text-[14px] text-cta-gold" />
                {site.sebutan.replace('Sekolah ', '')}
              </span>
            </div>
          </div>

          {/* Kolom 2: tautan penting */}
          <div>
            <h4 className="font-headline-sm text-headline-sm font-bold text-cta-gold mb-4">
              Tautan Penting
            </h4>
            <ul className="space-y-2.5 font-body-sm text-body-sm">
              {footerPenting.map((item) => (
                <li key={item.label}>
                  <FooterLink
                    item={item}
                    className={
                      item.highlight
                        ? 'text-cta-gold font-semibold flex items-center gap-1.5'
                        : linkBiasa
                    }
                  >
                    <Icon name="chevron_right" className="text-[14px]" />
                    {item.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: layanan */}
          <div>
            <h4 className="font-headline-sm text-headline-sm font-bold text-cta-gold mb-4">
              Layanan &amp; Regulasi
            </h4>
            <ul className="space-y-2.5 font-body-sm text-body-sm">
              {footerLayanan.map((item) => (
                <li key={item.label}>
                  <FooterLink item={item} className={linkBiasa}>
                    <Icon name={item.icon} className="text-[14px]" />
                    {item.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4: kontak & peta */}
          <div>
            <h4 className="font-headline-sm text-headline-sm font-bold text-cta-gold mb-4">
              Kontak &amp; Lokasi
            </h4>
            <div className="space-y-3 font-body-sm text-body-sm text-surface-container-low">
              <p className="flex items-start gap-2.5">
                <Icon name="location_on" className="text-[18px] text-cta-gold shrink-0 mt-0.5" />
                <span>{site.alamat}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Icon name="call" className="text-[18px] text-cta-gold shrink-0" />
                <span>{site.teleponFooter}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Icon name="mail" className="text-[18px] text-cta-gold shrink-0" />
                <span>{site.email}</span>
              </p>
            </div>
            <div className="mt-4 rounded-lg overflow-hidden border border-white/20 aspect-[16/7] relative">
              <img
                className="w-full h-full object-cover"
                src={petaFooter.gambar}
                alt={petaFooter.alt}
                loading="lazy"
              />
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-primary/40 hover:bg-transparent transition-colors flex items-center justify-center text-xs font-bold text-white gap-1"
              >
                <Icon name="map" className="text-[16px]" />
                Buka Google Maps
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-label-sm font-label-sm text-surface-container-low/75">
          <p>
            © {site.tahun} {site.nama}. Hak Cipta Dilindungi Undang-Undang. Terakreditasi Unggul (A)
            BAN-S/M. {site.sebutan}.
          </p>
          <div className="flex items-center gap-4">
            {footerBawah.map((item, i) => (
              <span key={item.label} className="flex items-center gap-4">
                {i > 0 && <span aria-hidden="true">•</span>}
                <FooterLink item={item} className="hover:text-cta-gold transition-colors">
                  {item.label}
                </FooterLink>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
