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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-surface-white text-on-surface antialiased">
      {/* Cahaya hijau lembut di kiri atas & kanan tengah */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(47,107,25,0.10),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-1/3 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(225,225,0,0.08),transparent_70%)]"
      />

      <LoginTopBar />

      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-12">
        <LoginBrand />
        <LoginForm onSubmit={masuk} memproses={memproses} galat={galat} />
        <Link to="/" className="mt-8 inline-flex items-center gap-2 text-title-md font-semibold text-secondary hover:underline">
          <Icon name="arrow_back" className="text-[20px]" />
          {loginTeks.kartu.kembali}
        </Link>
      </main>

      <LoginFooter />
    </div>
  )
}
