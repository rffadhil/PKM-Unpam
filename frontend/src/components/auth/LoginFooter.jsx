import { site } from '@/config/site'
import { loginTeks } from '@/config/login'

// Footer halaman login: hak cipta + tautan institusi.
export default function LoginFooter() {
  const { hakCipta } = loginTeks.footer
  return (
    <footer className="relative z-10 border-t border-border-muted bg-surface-white px-4 py-3 text-xs leading-4 text-text-muted sm:px-8 sm:py-5 sm:text-body-sm">
      <p>{hakCipta(new Date().getFullYear(), site.nama)}</p>
    </footer>
  )
}
