import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { site, pengumumanUtama } from '@/config/site'

// Strip utilitas (NPSN, kontak) + banner pengumuman yang bisa ditutup.
export default function TopBar() {
  const [bannerTampil, setBannerTampil] = useState(true)

  return (
    <aside
      aria-label="Pengumuman Resmi dan Utilitas Kontak"
      className="bg-primary-container text-surface-container-lowest z-50"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-1.5 flex flex-wrap justify-between items-center text-body-sm font-body-sm border-b border-secondary/30">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 opacity-90">
            <Icon name="verified" className="text-[16px] text-cta-gold" />
            NPSN: {site.npsn}
          </span>
          <span className="hidden sm:inline-block text-secondary">•</span>
          <span className="flex items-center gap-1.5 opacity-90">
            <Icon name="call" className="text-[16px] text-cta-gold" />
            {site.telepon}
          </span>
          <span className="hidden md:inline-block text-secondary">•</span>
          <span className="hidden md:flex items-center gap-1.5 opacity-90">
            <Icon name="mail" className="text-[16px] text-cta-gold" />
            {site.email}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-secondary px-2 py-0.5 rounded text-[11px] font-bold text-surface-container-lowest">
            {site.sebutan.replace('Sekolah ', '')}
          </span>
          <a
            className="text-cta-gold hover:underline flex items-center gap-1 font-semibold text-body-sm"
            href={site.sisUrl}
          >
            <span>Portal SIS / CBT</span>
            <Icon name="open_in_new" className="text-[14px]" />
          </a>
        </div>
      </div>

      {bannerTampil && (
        <div className="bg-primary py-2 px-4 border-b border-tertiary-container">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-hidden text-body-sm font-body-sm">
              <span className="bg-cta-gold text-primary-container font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0 animate-pulse">
                Penting
              </span>
              <p className="truncate text-surface-container-lowest">
                <strong className="text-cta-gold">{pengumumanUtama.label}</strong>{' '}
                {pengumumanUtama.teks}
                <Link
                  className="text-cta-gold underline ml-2 font-bold inline-flex items-center hover:text-white"
                  to={pengumumanUtama.to}
                >
                  {pengumumanUtama.linkLabel}
                  <Icon name="arrow_forward" className="text-[14px] ml-0.5" />
                </Link>
              </p>
            </div>
            <button
              type="button"
              aria-label="Tutup Pengumuman"
              onClick={() => setBannerTampil(false)}
              className="text-surface-container-low hover:text-cta-gold shrink-0 transition-colors"
            >
              <Icon name="close" className="text-[18px]" />
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
