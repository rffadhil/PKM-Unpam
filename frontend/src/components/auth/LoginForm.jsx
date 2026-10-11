import { useState } from 'react'
import { ArrowRight, CircleCheck, Eye, EyeOff, KeyRound, LoaderCircle, Mail, ShieldCheck } from 'lucide-react'
import FormField from '@/components/ui/FormField'
import { login } from '@/services/authService'

const emailValid = (v) => /^\S+@\S+\.\S+$/.test(v.trim())
const nipValid = (v) => /^\d{18}$/.test(v.trim())

const inputClass =
  'min-w-0 flex-1 border-0 bg-transparent p-0 text-body-md text-primary outline-none ring-0 placeholder:text-text-muted/70 focus:ring-0'

// Seluruh state & logika login ada di sini. Halaman cukup memberi `onSuccess`.
export default function LoginForm({ onSuccess, lupaSandiEmail }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [lihat, setLihat] = useState(false)
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const idOk = emailValid(identifier) || nipValid(identifier)

  async function handleSubmit(e) {
    e.preventDefault()
    const next = {}
    if (!identifier.trim()) next.identifier = 'Isi email pengguna atau NIP Anda.'
    else if (!idOk) next.identifier = 'Format tidak dikenali. Gunakan email resmi atau NIP 18 digit.'
    if (!password) next.password = 'Isi kata sandi Anda.'
    setErrors(next)
    setServerError('')
    if (Object.keys(next).length) return

    setLoading(true)
    try {
      const session = await login({ identifier, password, remember })
      onSuccess?.(session)
    } catch (err) {
      setServerError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 px-6 py-7 sm:px-8">
      {serverError && (
        <p role="alert" className="rounded-xl border border-error/30 bg-error-container px-4 py-3 text-sm text-on-error-container">
          {serverError}
        </p>
      )}

      <FormField
        id="identifier"
        label="Email Pengguna / NIP"
        icon={Mail}
        error={errors.identifier}
        right={idOk && <CircleCheck size={20} className="shrink-0 text-secondary" aria-label="Format valid" />}
      >
        <input
          id="identifier"
          type="text"
          autoComplete="username"
          inputMode="email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          aria-invalid={Boolean(errors.identifier)}
          aria-describedby={errors.identifier ? 'identifier-error' : undefined}
          placeholder="nama@smaharapanjaya.sch.id"
          className={inputClass}
        />
      </FormField>

      <FormField
        id="password"
        label="Kata Sandi"
        icon={KeyRound}
        error={errors.password}
        aside={
          <span className="rounded bg-secondary-container/50 px-2.5 py-0.5 text-xs font-bold text-secondary-dark">
            Otentikasi 2FA Aktif
          </span>
        }
        right={
          <button
            type="button"
            onClick={() => setLihat((v) => !v)}
            aria-pressed={lihat}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm text-text-muted hover:text-secondary"
          >
            {lihat ? <EyeOff size={18} /> : <Eye size={18} />}
            {lihat ? 'Sembunyikan' : 'Tampilkan'}
          </button>
        }
      >
        <input
          id="password"
          type={lihat ? 'text' : 'password'}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'password-error' : undefined}
          placeholder="Masukkan kata sandi"
          className={inputClass}
        />
      </FormField>

      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 text-sm">
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded border-border-muted text-primary focus:ring-secondary"
          />
          <span>Ingat sesi saya di perangkat ini</span>
        </label>
        <a
          href={`mailto:${lupaSandiEmail}?subject=Lupa%20kata%20sandi%20CMS`}
          className="font-medium text-secondary hover:underline"
        >
          Lupa kata sandi? Hubungi Tim IT
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta-gold py-4 text-headline-sm font-bold text-primary shadow-sm transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <LoaderCircle size={22} className="animate-spin" /> Memeriksa kredensial…
          </>
        ) : (
          <>
            Masuk Dashboard <ArrowRight size={22} />
          </>
        )}
      </button>

      <div className="flex gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-text-muted">
        <ShieldCheck size={22} className="mt-0.5 shrink-0 text-secondary" />
        <p className="text-body-md">
          Akses terbatas hanya untuk Kepala Sekolah, Tim Redaksi Publikasi, serta Tenaga Administrasi Terdaftar. Semua aktivitas login tercatat pada audit log.
        </p>
      </div>
    </form>
  )
}
