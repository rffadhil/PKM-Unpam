import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock } from 'lucide-react'
import LoginTopBar from '@/components/auth/LoginTopBar'
import LoginBrand from '@/components/auth/LoginBrand'
import LoginForm from '@/components/auth/LoginForm'
import LoginFooter from '@/components/auth/LoginFooter'

const NPSN = '20104829'
const EMAIL_TIM_IT = 'ti@smaharapanjaya.sch.id' // TODO: ganti dengan alamat tim IT yang benar

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const tujuan = location.state?.from?.pathname ?? '/admin'

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-surface-light font-body-md text-on-surface">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-secondary-container/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/3 h-[26rem] w-[26rem] rounded-full bg-tertiary-fixed/25 blur-3xl" />

      <LoginTopBar npsn={NPSN} bantuanEmail={EMAIL_TIM_IT} />

      <main className="relative z-10 flex flex-1 flex-col items-center px-4 py-12 sm:py-16">
        <LoginBrand />

        <div className="mt-8 w-full max-w-xl overflow-hidden rounded-2xl border border-border-muted bg-surface-white shadow-sm">
          <div className="flex items-center gap-4 border-b border-border-muted bg-surface-light/60 px-6 py-5 sm:px-8">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-cta-gold">
              <Lock size={22} />
            </span>
            <div>
              <h2 className="text-headline-sm font-bold text-primary">Masuk ke Dashboard CMS</h2>
              <p className="text-sm text-text-muted">Gunakan kredensial resmi staf IT / Administrator sekolah</p>
            </div>
          </div>

          <LoginForm onSuccess={() => navigate(tujuan, { replace: true })} lupaSandiEmail={EMAIL_TIM_IT} />

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-border-muted bg-surface-light/60 px-6 py-4 text-xs font-bold tracking-wide text-text-muted">
            <span className="inline-flex items-center gap-2">
              <Lock size={16} className="text-secondary" /> Enkripsi SSL 256-bit terverifikasi
            </span>
            <span aria-hidden className="hidden h-1 w-1 rounded-full bg-text-muted sm:block" />
            <span>Khusus Operator Resmi BAN-S/M</span>
          </div>
        </div>

        <Link to="/" className="mt-8 inline-flex items-center gap-2 font-semibold text-secondary hover:underline">
          <ArrowLeft size={18} /> Kembali ke Halaman Publik Sekolah
        </Link>
      </main>

      <LoginFooter />
    </div>
  )
}
