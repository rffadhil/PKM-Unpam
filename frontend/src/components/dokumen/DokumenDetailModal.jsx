import ModalDialog from '@/components/ui/ModalDialog'
import IkonBerkas from '@/components/dokumen/IkonBerkas'
import StatusDokumenBadge from '@/components/dokumen/StatusDokumenBadge'
import { FORMAT_DOKUMEN } from '@/config/dokumenAdmin'
import { formatUkuran, formatWaktuUnggah } from '@/utils/dokumen'

function Baris({ label, children }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-2.5 text-sm">
      <dt className="text-text-muted">{label}</dt>
      <dd className="col-span-2 font-medium text-on-surface">{children || '-'}</dd>
    </div>
  )
}

// Rincian satu dokumen (tombol mata di tabel).
export default function DokumenDetailModal({ dok, onEdit, onTutup }) {
  return (
    <ModalDialog
      judul="Detail Dokumen"
      onTutup={onTutup}
      footer={
        <>
          <button type="button" onClick={onTutup} className="rounded-lg px-4 py-2 text-sm font-semibold text-text-muted hover:bg-surface-container">
            Tutup
          </button>
          {dok.url ? (
            <a href={dok.url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border-muted px-4 py-2 text-sm font-semibold text-primary hover:bg-surface-light">
              Buka Berkas
            </a>
          ) : (
            <span className="rounded-lg border border-border-muted px-4 py-2 text-sm font-semibold text-text-muted/60" title="Berkas contoh belum terhubung ke server">
              Berkas belum terhubung
            </span>
          )}
          <button type="button" onClick={() => onEdit(dok)} className="rounded-full bg-cta-gold px-5 py-2 text-sm font-bold text-primary hover:brightness-95">
            Edit Data
          </button>
        </>
      }
    >
      <div className="flex items-center gap-4">
        <IkonBerkas tipe={dok.tipe} className="h-14 w-14" />
        <p className="text-lg font-bold leading-snug text-primary">{dok.nama}.{dok.tipe}</p>
      </div>
      <dl className="mt-4 divide-y divide-border-muted">
        <Baris label="Deskripsi">{dok.deskripsi}</Baris>
        <Baris label="Kategori">{dok.kategori}</Baris>
        <Baris label="Format">{FORMAT_DOKUMEN[dok.tipe]?.label}</Baris>
        <Baris label="Ukuran">{formatUkuran(dok.ukuranBytes)}</Baris>
        <Baris label="Versi">{dok.versi}</Baris>
        <Baris label="Pengunggah">{dok.pengunggah}</Baris>
        <Baris label="Diunggah">{formatWaktuUnggah(dok.diunggah)}</Baris>
        <Baris label="Status"><StatusDokumenBadge aktif={dok.aktif} /></Baris>
      </dl>
    </ModalDialog>
  )
}
