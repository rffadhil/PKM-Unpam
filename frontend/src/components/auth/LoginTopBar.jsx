import Icon from '@/components/ui/Icon'
import { site } from '@/config/site'
import { loginTeks } from '@/config/login'

// Bilah hijau di atas halaman login: identitas portal, status server, bantuan.
export default function LoginTopBar() {
  const t = loginTeks.topBar
  return (
    <header className="flex items-center justify-between gap-4 bg-primary-container px-4 py-3 text-surface-white sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/40 text-cta-gold">
          <Icon name="shield" className="text-[20px]" />
        </span>
        <p className="truncate text-label-lg font-bold">{t.judul}</p>
        <p className="hidden text-label-lg text-secondary-fixed-dim sm:block">
          <span className="mr-2 text-cta-gold">•</span>NPSN: {site.npsn}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <span className="hidden items-center gap-2 rounded-full border border-secondary-fixed-dim/30 px-3 py-1 text-body-sm text-secondary-fixed-dim md:inline-flex">
          <span className="h-2 w-2 rounded-full bg-cta-gold" aria-hidden="true" />
          {t.statusServer}
        </span>
        <a href={t.bantuanHref} className="inline-flex items-center gap-1.5 text-label-lg hover:underline">
          <Icon name="support_agent" className="text-[18px]" />
          <span className="hidden sm:inline">{t.bantuan}</span>
        </a>
      </div>
    </header>
  )
}
