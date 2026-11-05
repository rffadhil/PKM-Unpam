import ModalDialog from '@/components/ui/ModalDialog'
import StafFoto from '@/components/staf/StafFoto'
import JabatanBadge from '@/components/staf/JabatanBadge'
import StatusPegawaiBadge from '@/components/staf/StatusPegawaiBadge'
import { labelNomor } from '@/utils/ptk'

function Baris({ label, children }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-2.5 text-sm">
      <dt className="text-text-muted">{label}</dt>
      <dd className="col-span-2 font-medium text-on-surface">{children || '-'}</dd>
    </div>
  )
}

// Rincian satu PTK (tombol mata di tabel).
export default function StafDetailModal({ staf, onEdit, onTutup }) {
  return (
    <ModalDialog
      judul="Detail Pendidik / Staf"
      onTutup={onTutup}
      footer={
        <>
          <button type="button" onClick={onTutup} className="rounded-lg px-4 py-2 text-sm font-semibold text-text-muted hover:bg-surface-container">
            Tutup
          </button>
          <button type="button" onClick={() => onEdit(staf)} className="rounded-full bg-cta-gold px-5 py-2 text-sm font-bold text-primary hover:brightness-95">
            Edit Data
          </button>
        </>
      }
    >
      <div className="flex items-center gap-4">
        <StafFoto key={staf.foto} nama={staf.nama} src={staf.foto} className="h-16 w-16 text-lg" />
        <div>
          <p className="text-lg font-bold leading-snug text-primary">{staf.nama}</p>
          <p className="mt-0.5 font-mono text-xs text-text-muted">{labelNomor(staf)}</p>
        </div>
      </div>
      <dl className="mt-4 divide-y divide-border-muted">
        <Baris label="Jabatan"><JabatanBadge jabatan={staf.jabatan} tone={staf.tone} /></Baris>
        <Baris label="Rumpun">{staf.rumpun}</Baris>
        <Baris label="Bidang / mapel">{staf.bidang}</Baris>
        <Baris label="Pendidikan">{[staf.pendidikan, staf.kampus].filter(Boolean).join(', ')}</Baris>
        <Baris label="Kepegawaian"><StatusPegawaiBadge label={staf.kepegawaian} /></Baris>
        <Baris label="Di situs publik">{staf.tampil ? 'Ditampilkan' : 'Disembunyikan'}</Baris>
      </dl>
    </ModalDialog>
  )
}
