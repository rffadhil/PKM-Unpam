import { loginTeks } from '@/config/login'
import logoSekolah from '@/assets/logo-noBG.png'

// Identitas sekolah pada sisi kiri halaman login.
export default function LoginBrand() {
  const { judul, subjudul } = loginTeks.brand
  return (
    <div className="flex w-full min-w-0 items-center justify-center gap-3 text-left lg:flex-col lg:justify-center lg:gap-0 lg:text-center">
      <img
        src={logoSekolah}
        alt="Logo SMA Harapan Jaya"
        className="h-16 w-16 shrink-0 object-contain drop-shadow-sm sm:h-20 sm:w-20 lg:mb-4 lg:h-[22rem] lg:w-[22rem]"
      />
      <div className="min-w-0 lg:flex lg:flex-col lg:items-center">
        <h1 className="font-headline-lg text-base font-bold tracking-tight text-primary-container sm:text-lg lg:text-3xl">
          {judul}
        </h1>
        <p className="mt-1 text-xs font-medium text-text-muted sm:text-sm lg:mt-2 lg:text-lg">{subjudul}</p>
      </div>
    </div>
  )
}
