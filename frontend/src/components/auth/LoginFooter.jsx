import { Link } from 'react-router-dom'

export default function LoginFooter() {
  return (
    <footer className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-border-muted bg-surface-white px-4 py-4 text-sm text-text-muted sm:px-6">
      <p>© 2026 SMA Harapan Jaya. Hak Cipta Dilindungi Undang-Undang. Terakreditasi Unggul (A) BAN-S/M. Sekolah Adiwiyata Mandiri.</p>
      <p className="flex items-center gap-3 font-bold">
        <Link to="/profil" className="hover:text-secondary">Visi Unggul & Adiwiyata</Link>
        <span aria-hidden className="h-1 w-1 rounded-full bg-text-muted" />
        <Link to="/kontak" className="text-secondary hover:underline">Biro Teknologi Informasi</Link>
      </p>
    </footer>
  )
}
