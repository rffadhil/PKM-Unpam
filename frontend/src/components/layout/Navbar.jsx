import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '@/components/ui/Icon'
import { site } from '@/config/site'
import { navItems } from '@/config/navigation'

function itemAktif(item, pathname, hash) {
  if (item.hash) return pathname === item.to && hash === item.hash
  if (item.end) return pathname === item.to
  return pathname === item.to || pathname.startsWith(`${item.to}/`)
}

export default function Navbar() {
  const { pathname, hash } = useLocation()
  const [menuTerbuka, setMenuTerbuka] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest shadow-sm border-b border-border-muted transition-all">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Identitas sekolah */}
          <Link
            to="/"
            className="flex items-center gap-3.5 focus:outline-none focus:ring-2 focus:ring-secondary rounded-lg p-1"
          >
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight leading-none">
                {site.nama}
              </span>
              <span className="text-[11px] font-label-sm font-semibold tracking-wider text-text-muted mt-1 uppercase">
                {site.akreditasi}
              </span>
            </div>
          </Link>

          {/* Menu desktop */}
          <nav aria-label="Navigasi Utama" className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => {
              const aktif = itemAktif(item, pathname, hash)
              return (
                <Link
                  key={item.label}
                  to={{ pathname: item.to, hash: item.hash }}
                  aria-current={aktif ? 'page' : undefined}
                  className={clsx(
                    'transition-colors text-label-lg font-label-lg flex items-center gap-0.5',
                    aktif
                      ? 'text-secondary border-b-2 border-secondary pb-1 font-semibold'
                      : 'text-on-surface hover:text-secondary font-medium',
                  )}
                >
                  {item.label}
                  {item.icon && <Icon name={item.icon} className="text-[16px]" />}
                </Link>
              )
            })}
          </nav>

          {/* Aksi di kanan */}
          <div className="hidden sm:flex items-center gap-3">
            {/* TODO: pencarian global (PRD PU-06) */}
            <button
              type="button"
              aria-label="Cari Informasi Artikel dan Kegiatan"
              className="p-2 text-on-surface hover:text-secondary rounded-full hover:bg-surface-light transition-all duration-150 active:scale-95"
            >
              <Icon name="search" className="text-[20px]" />
            </button>
            {/* TODO: tombol terjemah ada di desain tetapi tidak ada di PRD — putuskan dipakai atau tidak */}
            <button
              type="button"
              aria-label="Terjemahkan Bahasa"
              className="p-2 text-on-surface hover:text-secondary rounded-full hover:bg-surface-light transition-all duration-150 active:scale-95"
            >
              <Icon name="translate" className="text-[20px]" />
            </button>
            <a
              href={site.sisUrl}
              className="px-3.5 py-2 text-label-lg font-label-lg font-semibold text-secondary border border-secondary rounded-lg hover:bg-secondary/10 transition-all duration-150 active:scale-95"
            >
              Portal SIS
            </a>
            <Link
              to="/ppdb"
              className="px-4 py-2 text-label-lg font-label-lg font-bold bg-cta-gold text-primary rounded-lg shadow-sm hover:bg-[#d4d400] transition-all duration-150 active:scale-95 flex items-center gap-1.5"
            >
              <Icon name="how_to_reg" className="text-[18px]" />
              Daftar PPDB
            </Link>
          </div>

          {/* Tombol menu seluler */}
          <button
            type="button"
            aria-label={menuTerbuka ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi'}
            aria-expanded={menuTerbuka}
            aria-controls="menu-seluler"
            onClick={() => setMenuTerbuka((buka) => !buka)}
            className="lg:hidden p-2 text-on-surface hover:text-secondary"
          >
            <Icon name={menuTerbuka ? 'close' : 'menu'} className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Menu seluler (tidak ada di desain Stitch — dibuat dari item menu yang sama) */}
      {menuTerbuka && (
        <div id="menu-seluler" className="lg:hidden border-t border-border-muted bg-surface-container-lowest">
          <nav aria-label="Navigasi Seluler" className="max-w-7xl mx-auto px-4 py-2 flex flex-col">
            {navItems.map((item) => {
              const aktif = itemAktif(item, pathname, hash)
              return (
                <Link
                  key={item.label}
                  to={{ pathname: item.to, hash: item.hash }}
                  aria-current={aktif ? 'page' : undefined}
                  onClick={() => setMenuTerbuka(false)}
                  className={clsx(
                    'py-3 border-b border-border-muted text-label-lg font-label-lg',
                    aktif ? 'text-secondary font-bold' : 'text-on-surface font-medium',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="flex gap-3 py-4">
              <a
                href={site.sisUrl}
                className="flex-1 text-center px-3.5 py-2.5 text-label-lg font-label-lg font-semibold text-secondary border border-secondary rounded-lg"
              >
                Portal SIS
              </a>
              <Link
                to="/ppdb"
                onClick={() => setMenuTerbuka(false)}
                className="flex-1 text-center px-4 py-2.5 text-label-lg font-label-lg font-bold bg-cta-gold text-primary rounded-lg"
              >
                Daftar PPDB
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
