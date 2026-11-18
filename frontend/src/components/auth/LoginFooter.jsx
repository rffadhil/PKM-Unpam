import { site } from '@/config/site'
import { loginTeks } from '@/config/login'

// Footer halaman login: hak cipta + tautan institusi terhubung ke pengaturan portal.
export default function LoginFooter({ portal: portalProp }) {
  let portal = portalProp
  if (!portal && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('cms_portal_pengaturan')
      if (cached) {
        portal = JSON.parse(cached)
      }
    } catch {}
  }

  const { hakCipta } = loginTeks.footer
  const nama = portal?.namaInstitusi || portal?.nama_sekolah || site.nama
  const akreditasi = portal?.akreditasi
  const adiwiyata = portal?.adiwiyata || portal?.predikat_adiwiyata

  return (
    <footer className="relative z-10 border-t border-border-muted bg-surface-white px-4 py-3 text-xs leading-4 text-text-muted sm:px-8 sm:py-5 sm:text-body-sm">
      <p>{hakCipta(new Date().getFullYear(), nama, akreditasi, adiwiyata)}</p>
    </footer>
  )
}
