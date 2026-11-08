import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import LoginTopBar from '@/components/auth/LoginTopBar'
import LoginBrand from '@/components/auth/LoginBrand'
import LoginForm from '@/components/auth/LoginForm'
import LoginFooter from '@/components/auth/LoginFooter'
import { login } from '@/services/authService'
import { loginTeks } from '@/config/login'

// Halaman login CMS: hanya perakit layout + state proses login.
export default function LoginPage() {
  const navigate = useNavigate()
  const [memproses, setMemproses] = useState(false)
  const [galat, setGalat] = useState('')

  async function masuk(kredensial) {
    setGalat('')
    setMemproses(true)
    try {
      await login(kredensial)
      navigate('/admin', { replace: true })
    } catch (e) {
      setGalat(e.message || 'Gagal masuk. Coba lagi beberapa saat.')
    } finally {
      setMemproses(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f7f9f8] text-on-surface antialiased">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(47,107,25,0.10),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-1/3 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(225,225,0,0.08),transparent_70%)]"
      />

      <LoginTopBar />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:px-6 md:py-10">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <LoginBrand />
          <div className="mx-auto w-full max-w-[500px] lg:translate-y-6">
            <LoginForm onSubmit={masuk} memproses={memproses} galat={galat} />
            <div className="mt-6 text-center">
              <Link to="/" className="inline-flex items-center gap-2 text-title-md font-semibold text-secondary hover:underline">
                <Icon name="arrow_back" className="text-[20px]" />
                {loginTeks.kartu.kembali}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <LoginFooter />
    </div>
  )
}
