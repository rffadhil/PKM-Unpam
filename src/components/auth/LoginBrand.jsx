import { loginTeks } from '@/config/login'
import logoSekolah from '@/assets/logo-noBG.png'

// Identitas sekolah pada sisi kiri halaman login.
export default function LoginBrand() {
  const { judul, subjudul } = loginTeks.brand
  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={logoSekolah}
        alt="Logo SMA Harapan Jaya"
        className="mb-4 h-64 w-64 object-contain drop-shadow-sm sm:h-72 sm:w-72 lg:h-[22rem] lg:w-[22rem]"
      />
      <h1 className="font-headline-lg text-3xl font-bold tracking-tight text-primary-container sm:text-4xl">
        {judul}
      </h1>
      <p className="mt-2 text-base font-medium text-text-muted sm:text-lg">{subjudul}</p>
    </div>
  )
}
