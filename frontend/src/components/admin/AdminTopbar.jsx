import Icon from '@/components/ui/Icon'
import Avatar from '@/components/ui/Avatar'
import { adminUser } from '@/mocks/admin'

// Topbar ringkas: judul halaman, pencarian, notifikasi, profil. (Tanpa breadcrumb & status server.)
export default function AdminTopbar({ judul, placeholderCari, pencarian, onCari, onBukaMenu }) {
  return (
    <header className="h-16 shrink-0 bg-surface-white border-b border-border-muted flex items-center justify-between gap-4 px-4 lg:px-6 z-10">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          aria-label="Buka menu navigasi"
          onClick={onBukaMenu}
          className="lg:hidden p-2 -ml-2 text-on-surface hover:text-secondary"
        >
          <Icon name="menu" className="text-2xl" />
        </button>
        <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight leading-tight truncate">
          {judul}
        </h1>
      </div>

      <div className="relative w-full max-w-sm hidden md:block">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
          <Icon name="search" className="text-[20px]" />
        </span>
        <input
          type="search"
          value={pencarian}
          onChange={(e) => onCari(e.target.value)}
          placeholder={placeholderCari}
          aria-label="Cari di halaman ini"
          className="w-full pl-9 pr-4 py-1.5 text-body-sm font-body-sm bg-surface-light border border-border-muted rounded-full focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all placeholder:text-text-muted/70 text-on-surface"
        />
      </div>

      <div className="flex items-center gap-3.5 shrink-0">
        <button
          type="button"
          aria-label={`Notifikasi, ${adminUser.notifikasi} belum dibaca`}
          className="relative p-2 text-text-muted hover:text-primary hover:bg-surface-light rounded-full transition-colors"
        >
          <Icon name="notifications" className="text-[22px]" />
          {adminUser.notifikasi > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-error text-on-error rounded-full text-[10px] font-bold flex items-center justify-center">
              {adminUser.notifikasi}
            </span>
          )}
        </button>
        <div className="flex items-center gap-3 pl-3.5 border-l border-border-muted">
          <Avatar ukuran="md" nama={adminUser.nama} inisial={adminUser.inisial} src={adminUser.foto} />
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-on-surface leading-tight">{adminUser.nama}</span>
            <span className="text-[11px] text-text-muted leading-tight">{adminUser.peran}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
