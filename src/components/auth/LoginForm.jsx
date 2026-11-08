import { useState } from 'react'
import Icon from '@/components/ui/Icon'
import LoginField from '@/components/auth/LoginField'
import LoginInfoBox from '@/components/auth/LoginInfoBox'
import { loginTeks } from '@/config/login'

const EMAIL_VALID = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Kartu login. Hanya mengurus input; proses autentikasi dikirim lewat onSubmit({ email, password, ingat }).
export default function LoginForm({ onSubmit, memproses = false, galat = '' }) {
  const t = loginTeks.kartu
  const [email, setEmail] = useState('')
  const [sandi, setSandi] = useState('')
  const [tampil, setTampil] = useState(false)
  const [ingat, setIngat] = useState(true)

  function kirim(e) {
    e.preventDefault()
    if (memproses) return
    onSubmit({ email: email.trim(), password: sandi, ingat })
  }

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-border-muted bg-surface-white shadow-lg">
      <div className="flex items-center gap-4 border-b border-border-muted bg-surface-light px-5 py-4 sm:px-7">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-cta-gold">
          <Icon name="admin_panel_settings" className="text-[24px]" />
        </span>
        <div className="min-w-0">
          <h2 className="text-headline-sm font-bold text-primary-container">{t.judul}</h2>
          <p className="text-body-sm text-text-muted">{t.subjudul}</p>
        </div>
      </div>

      <form onSubmit={kirim} noValidate className="space-y-4 px-5 py-5 sm:px-7">
        <LoginField
          label={t.labelEmail}
          ikon="mail"
          type="text"
          name="email"
          autoComplete="username"
          placeholder={t.placeholderEmail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aksi={EMAIL_VALID.test(email) && <Icon name="check_circle" className="text-[22px] text-secondary" />}
        />

        <LoginField
          label={t.labelSandi}
          ikon="key"
          type={tampil ? 'text' : 'password'}
          name="password"
          autoComplete="current-password"
          placeholder={t.placeholderSandi}
          value={sandi}
          onChange={(e) => setSandi(e.target.value)}
          aksi={
            <button
              type="button"
              onClick={() => setTampil((v) => !v)}
              aria-pressed={tampil}
              className="inline-flex shrink-0 items-center gap-1.5 text-body-sm text-text-muted hover:text-primary-container"
            >
              <Icon name={tampil ? 'visibility_off' : 'visibility'} className="text-[20px]" />
              {tampil ? 'Sembunyikan' : 'Tampilkan'}
            </button>
          }
        />

        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <label className="flex cursor-pointer items-start gap-3 text-body-md text-on-surface">
            <input
              type="checkbox"
              checked={ingat}
              onChange={(e) => setIngat(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-border-muted text-primary-container focus:ring-secondary"
            />
            {t.ingat}
          </label>
          <a href={t.lupaHref} className="text-body-md font-medium text-secondary hover:underline">
            {t.lupa}
          </a>
        </div>

        {galat && (
          <p role="alert" className="rounded-xl bg-error-container px-4 py-3 text-body-sm font-medium text-on-error-container">
            {galat}
          </p>
        )}

        <button
          type="submit"
          disabled={memproses}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cta-gold py-4 text-title-md font-bold text-primary-container shadow-sm transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-container disabled:cursor-not-allowed disabled:opacity-70"
        >
          {memproses ? t.tombolProses : t.tombol}
          {!memproses && <Icon name="arrow_forward" className="text-[22px]" />}
        </button>

        <LoginInfoBox />
      </form>
    </section>
  )
}
