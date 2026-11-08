import Icon from '@/components/ui/Icon'
import { site } from '@/config/site'
import { loginTeks } from '@/config/login'

// Bilah identitas portal pada halaman login.
export default function LoginTopBar() {
  const t = loginTeks.topBar
  return (
    <header className="relative z-10 flex items-center bg-primary-container px-4 py-3 text-surface-white sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/40 text-cta-gold">
          <Icon name="shield" className="text-[20px]" />
        </span>
        <p className="truncate text-label-lg font-bold">{t.judul}</p>
        <p className="hidden text-label-lg text-secondary-fixed-dim sm:block">
          <span className="mr-2 text-cta-gold">•</span>NPSN: {site.npsn}
        </p>
      </div>
    </header>
  )
}
