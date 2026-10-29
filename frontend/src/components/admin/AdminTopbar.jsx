import Icon from '@/components/ui/Icon'
import Avatar from '@/components/ui/Avatar'
import { adminUser } from '@/mocks/admin'

// Topbar ringkas: judul halaman dan profil admin.
export default function AdminTopbar({ judul, onBukaMenu }) {
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

      <div className="flex items-center gap-3 shrink-0 ml-auto">
        <Avatar ukuran="md" nama={adminUser.nama} inisial={adminUser.inisial} src={adminUser.foto} />
        <div className="hidden xl:flex flex-col text-left">
          <span className="text-xs font-bold text-on-surface leading-tight">{adminUser.nama}</span>
          <span className="text-[11px] text-text-muted leading-tight">{adminUser.peran}</span>
        </div>
      </div>
    </header>
  )
}