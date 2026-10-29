import { Link, NavLink } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '@/components/ui/Icon'
import Avatar from '@/components/ui/Avatar'
import { site } from '@/config/site'
import { adminNavItems } from '@/config/adminNav'
import { adminUser } from '@/mocks/admin'

const BADGE_BAWAAN = 'bg-surface-white/20 text-surface-white text-[11px] font-semibold px-2 py-0.5 rounded-full'
const BADGE_MERAH = 'bg-error text-on-error text-[10px] font-bold px-2 py-0.5 rounded-full'
const VERSI = 'V1.2 PRODUCTION' // TODO: ambil dari API / env

// Sidebar tetap 260px di desktop; di layar kecil menjadi laci yang bisa dibuka dari topbar.
export default function AdminSidebar({ terbuka, onTutup }) {
  return (
    <>
      {terbuka && (
        <div className="fixed inset-0 z-30 bg-primary/50 lg:hidden" onClick={onTutup} aria-hidden="true" />
      )}
      <aside
        aria-label="Sidebar CMS"
        className={clsx(
          'w-[260px] bg-primary-container shrink-0 flex flex-col justify-between h-full select-none shadow-xl z-40',
          'fixed inset-y-0 left-0 transition-transform duration-200 lg:static lg:translate-x-0',
          terbuka ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex flex-col min-h-0">
          {/* Identitas CMS */}
          <div className="px-5 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-white flex items-center justify-center shadow-md shrink-0">
                <Icon name="school" className="text-[24px] text-primary-container" />
              </div>
              <div className="min-w-0">
                <span className="block text-sm font-bold text-surface-white truncate leading-tight">
                  CMS {site.nama}
                </span>
                <span className="block text-[12px] text-surface-white/70 truncate">
                  Portal Publikasi &amp; Informasi
                </span>
              </div>
            </div>
          </div>

          {/* Navigasi */}
          <nav aria-label="Navigasi CMS" className="px-3 py-4 space-y-1.5 overflow-y-auto">
            <div className="px-3 pt-1 pb-1.5 text-[11px] font-bold tracking-wider text-surface-white/50 uppercase">
              Navigasi Utama
            </div>
            {adminNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onTutup}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-cta-gold text-primary font-bold'
                      : 'text-surface-white/80 hover:text-surface-white hover:bg-secondary/40 font-medium',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-3 min-w-0">
                      <Icon name={item.ikon} className="text-[20px]" />
                      <span className="font-label-lg text-label-lg">{item.label}</span>
                    </span>
                    {item.badge && (
                      <span className={item.badgeTone === 'merah' ? BADGE_MERAH : BADGE_BAWAAN}>
                        {item.badge}
                      </span>
                    )}
                    {item.ikonKanan && <Icon name={item.ikonKanan} className={clsx('text-[20px]', !isActive && 'opacity-60')} />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Akun & keluar */}
        <div className="p-3 border-t border-white/10 bg-primary/40">
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg bg-primary-container/60 border border-white/10">
            <Avatar
              ukuran="lg"
              nama={adminUser.namaSingkat}
              inisial={adminUser.inisial}
              src={adminUser.foto}
              online
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm text-surface-white font-bold truncate leading-tight">
                {adminUser.namaSingkat}
              </span>
              <span className="text-[12px] text-surface-white/70 truncate">{adminUser.jabatan}</span>
            </div>
            <Link
              to="/admin/pengaturan"
              aria-label="Pengaturan akun"
              className="shrink-0 rounded-md p-1.5 text-surface-white/70 hover:bg-white/10 hover:text-surface-white"
            >
              <Icon name="tune" className="text-[20px]" />
            </Link>
          </div>
          {/* TODO: panggil endpoint logout (hapus cookie JWT) sebelum pindah halaman */}
          <Link
            to="/admin/login"
            className="flex items-center justify-center gap-2.5 px-3 py-2 rounded-lg text-surface-white/80 hover:text-surface-white hover:bg-white/10 transition-colors font-medium text-sm"
          >
            <Icon name="logout" className="text-[18px]" />
            Keluar dari Sistem
          </Link>
        </div>
      </aside>
    </>
  )
}
