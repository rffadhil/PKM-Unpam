import { GraduationCap } from 'lucide-react'

// Logo + judul di atas kartu. Ganti ikon dengan <img> jika sekolah sudah punya logo.
export default function LoginBrand() {
  return (
    <div className="flex flex-col items-center">
      <div className="grid h-14 w-14 place-items-center rounded-full border border-border-muted bg-surface-white text-primary-container shadow-sm">
        <GraduationCap size={28} />
      </div>
      <h1 className="mt-8 text-center font-headline-lg text-headline-lg-mobile text-primary sm:text-headline-lg">
        Portal Admin & CMS
      </h1>
      <p className="mt-2 text-center text-body-lg text-text-muted">
        SMA Harapan Jaya - Publikasi & Tata Kelola Digital
      </p>
    </div>
  )
}
