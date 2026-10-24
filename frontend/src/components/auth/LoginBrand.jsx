import { loginTeks } from '@/config/login'

// Judul portal di atas kartu login.
export default function LoginBrand() {
  const { judul, subjudul } = loginTeks.brand
  return (
    <div className="mb-8 text-center">
      <h1 className="font-headline-lg text-headline-lg-mobile font-bold text-primary-container sm:text-headline-lg">
        {judul}
      </h1>
      <p className="mt-2 text-body-md text-text-muted sm:text-body-lg">{subjudul}</p>
    </div>
  )
}
