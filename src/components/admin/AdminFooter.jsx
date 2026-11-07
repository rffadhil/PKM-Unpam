import { site } from '@/config/site'

export default function AdminFooter() {
  return (
    <footer className="mt-auto bg-surface-white border-t border-border-muted px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-body-sm text-text-muted">
      <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span className="font-semibold text-primary">CMS {site.nama}</span>
        <span aria-hidden="true">•</span>
        <span>Terakreditasi Unggul (A) BAN-S/M</span>
        <span aria-hidden="true">•</span>
        <span className="text-secondary font-medium">{site.sebutan}</span>
      </p>
      <p>
        © {site.tahun} {site.nama}. Hak Cipta Dilindungi Undang-Undang.
      </p>
    </footer>
  )
}
