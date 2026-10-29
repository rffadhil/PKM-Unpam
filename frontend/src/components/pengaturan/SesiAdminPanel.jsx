import BagianPengaturan from '@/components/pengaturan/BagianPengaturan'
import { inisialAdmin } from '@/utils/pengaturan'

// Bagian "Manajemen Admin & Sesi Aktif" (untuk sub admin: hanya sesi milik sendiri).
export default function SesiAdminPanel({ sesi }) {
  return (
    <BagianPengaturan
      ikon="shield"
      judul="Manajemen Admin & Sesi Aktif"
      subjudul="Proteksi integritas sesi, timeout otomatis, dan kebijakan masa berlaku kata sandi"
    >
      <div className="rounded-xl border border-border-muted bg-surface-light/60 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Sesi Administrator</p>
          {sesi.aktif && <span className="rounded bg-secondary-container px-2 py-0.5 text-[10px] font-bold uppercase text-on-secondary-fixed-variant">Aktif</span>}
        </div>
        <div className="mt-3 flex items-center gap-4">
          <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-cta-gold">
            {inisialAdmin(sesi.nama)}
          </span>
          <div>
            <p className="font-bold text-primary">{sesi.nama}</p>
            <p className="text-body-sm text-secondary">Peran: {sesi.peran}</p>
            <p className="text-xs text-text-muted">IP: {sesi.ip} ({sesi.koneksi})</p>
          </div>
        </div>
      </div>
    </BagianPengaturan>
  )
}
