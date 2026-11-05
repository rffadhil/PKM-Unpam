import Icon from '@/components/ui/Icon'
import KartuAset from '@/components/pengaturan/KartuAset'
import { BATAS_ASET_MB } from '@/config/pengaturanAdmin'
import { inisialInstitusi } from '@/utils/pengaturan'

// Panel "Aset Visual Institusi": logo resmi dan favicon.
export default function AsetVisualPanel({ nilai, error, onGanti }) {
  return (
    <aside className="rounded-2xl border border-border-muted bg-surface-light/60 p-5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Aset Visual Institusi</h3>
      <div className="mt-4 space-y-3">
        <KartuAset
          pratinjau={
            nilai.logo ? (
              <img src={nilai.logo} alt="Pratinjau logo" className="h-16 w-16 shrink-0 rounded-xl border border-border-muted bg-white object-contain p-1" />
            ) : (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary-container text-cta-gold">
                <Icon name="school" className="text-[32px]" />
              </span>
            )
          }
          nama={nilai.logoNama}
          keterangan="512 x 512 px (Vektor)"
          labelTombol="Ganti Logo"
          ikonTombol="upload"
          accept=".svg,.png"
          onPilih={(f) => onGanti('logo', f)}
        />
        {error.logo && <p role="alert" className="text-xs text-error">{error.logo}</p>}

        <KartuAset
          pratinjau={
            nilai.favicon ? (
              <img src={nilai.favicon} alt="Pratinjau favicon" className="h-12 w-12 shrink-0 rounded-lg border border-border-muted bg-white object-contain p-1" />
            ) : (
              <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cta-gold text-sm font-bold text-primary">
                {inisialInstitusi(nilai.namaInstitusi)}
              </span>
            )
          }
          nama={nilai.faviconNama}
          keterangan="Tab Browser (32x32)"
          labelTombol="Perbarui"
          ikonTombol="sync"
          accept=".ico,.png,.svg"
          onPilih={(f) => onGanti('favicon', f)}
        />
        {error.favicon && <p role="alert" className="text-xs text-error">{error.favicon}</p>}
      </div>
      <p className="mt-4 text-xs text-text-muted">
        Format didukung: SVG, PNG transparan. Maksimum {BATAS_ASET_MB}MB per berkas.
      </p>
    </aside>
  )
}
