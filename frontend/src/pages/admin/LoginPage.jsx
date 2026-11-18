import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import LoginTopBar from '@/components/auth/LoginTopBar'
import LoginBrand from '@/components/auth/LoginBrand'
import LoginForm from '@/components/auth/LoginForm'
import LoginFooter from '@/components/auth/LoginFooter'
import { login } from '@/services/authService'
import { loginTeks } from '@/config/login'
import { applyBrowserBranding } from '@/utils/browserBranding'
import { mockPengaturan } from '@/mocks/adminPengaturan'
import { ambilPengaturanLengkap } from '@/services/pengaturan.service'

// Halaman login CMS: hanya perakit layout + state proses login.
export default function LoginPage() {
  const navigate = useNavigate()
  const [memproses, setMemproses] = useState(false)
  const [galat, setGalat] = useState('')
  const [portal, setPortal] = useState(() => {
    try {
      const cached = localStorage.getItem('cms_portal_pengaturan')
      if (cached) return { ...mockPengaturan, ...JSON.parse(cached) }
    } catch {}
    return mockPengaturan
  })

  useEffect(() => {
    const namaSekolah = portal.namaInstitusi || 'SMA Harapan Jaya'
    applyBrowserBranding({
      title: `CMS Admin — ${namaSekolah}`,
    })

    ambilPengaturanLengkap()
      .then((res) => {
        if (res?.portal) {
          setPortal((prev) => ({ ...prev, ...res.portal }))
          try {
            localStorage.setItem('cms_portal_pengaturan', JSON.stringify(res.portal))
          } catch {}
          applyBrowserBranding({
            title: `CMS Admin — ${res.portal.namaInstitusi || namaSekolah}`,
          })
        }
      })
      .catch(() => {})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function masuk(kredensial) {
    setGalat('')
    setMemproses(true)
    try {
      const { user } = await login(kredensial)
      navigate(
        user?.must_change_password ? '/admin/ganti-sandi' : '/admin',
        { replace: true },
      )
    } catch (e) {
      setGalat(e.message || 'Gagal masuk. Coba lagi beberapa saat.')
    } finally {
      setMemproses(false)
    }
  }

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[#f7f9f8] text-on-surface antialiased">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(47,107,25,0.10),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-1/3 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(225,225,0,0.08),transparent_70%)]"
      />

      <LoginTopBar portal={portal} />

      <main className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 py-3 sm:px-6 md:py-4">
        <div className="mx-auto grid h-full min-h-0 w-full max-w-6xl grid-cols-1 grid-rows-[auto_minmax(0,1fr)] items-stretch gap-3 rounded-2xl border border-border-muted bg-surface-white p-3 shadow-lg sm:gap-4 sm:p-5 lg:grid-cols-2 lg:grid-rows-1 lg:gap-8 lg:p-6">
          <div className="flex min-h-0 items-center justify-center">
            <LoginBrand portal={portal} />
          </div>
          <div className="mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col justify-center">
            <LoginForm onSubmit={masuk} memproses={memproses} galat={galat} />
            <div className="mt-2 shrink-0 text-center lg:mt-4">
              <Link to="/" className="inline-flex items-center gap-2 text-title-md font-semibold text-secondary hover:underline">
                <Icon name="arrow_back" className="text-[20px]" />
                {loginTeks.kartu.kembali}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <LoginFooter portal={portal} />
    </div>
  )
}
