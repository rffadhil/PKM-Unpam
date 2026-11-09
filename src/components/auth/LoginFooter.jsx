import { site } from '@/config/site'
import { loginTeks } from '@/config/login'

// Footer halaman login: hak cipta + tautan institusi.
export default function LoginFooter() {
  const { hakCipta } = loginTeks.footer
  return (
    <footer className="relative z-10 border-t border-border-muted bg-surface-white px-4 py-5 text-body-sm text-text-muted sm:px-8">
      <p>{hakCipta(new Date().getFullYear(), site.nama)}</p>
    </footer>
  )
}
