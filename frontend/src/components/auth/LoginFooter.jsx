import { site } from '@/config/site'
import { loginTeks } from '@/config/login'

// Footer halaman login: hak cipta + tautan institusi.
export default function LoginFooter() {
  const { hakCipta, tautan } = loginTeks.footer
  return (
    <footer className="flex flex-col gap-2 border-t border-border-muted bg-surface-white px-4 py-5 text-body-sm text-text-muted sm:px-8 lg:flex-row lg:items-center lg:justify-between">
      <p>{hakCipta(new Date().getFullYear(), site.nama)}</p>
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 font-semibold">
        {tautan.map((teks, i) => (
          <li key={teks} className="flex items-center gap-4">
            {i > 0 && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-text-muted" />}
            <span className={i === tautan.length - 1 ? 'text-secondary' : ''}>{teks}</span>
          </li>
        ))}
      </ul>
    </footer>
  )
}
